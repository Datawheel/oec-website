import os, sys, json, logging, warnings
import math
import pandas as pd
from numpy import timedelta64
from numpy.random import seed
logging.getLogger('fbprophet').setLevel(logging.CRITICAL)
from fbprophet import Prophet
import requests

# test with:
# python -W ignore calcs/predictions.py '{"cube":"services_i_comtrade_a_eb02","Reporter Country":"sapry","drilldowns":"Year","measures":"Service Value","start_time":"2001","end_time":"2018"}'
# python -W ignore calcs/predictions.py '{"cube":"trade_i_baci_a_92","Reporter Country":"sachl","drilldowns":"Year","measures":"Trade Value","start_time":"1998","end_time":"2018"}'
# python -W ignore calcs/predictions.py '{"cube":"trade_i_comtrade_m_hs","Reporter Country":"sachl","drilldowns":"Time","measures":"Trade Value","start_time":"201101","end_time":"202001"}'

DEBUG = False
# DEBUG = True

class suppress_stdout_stderr(object):
  '''
  A context manager for doing a "deep suppression" of stdout and stderr in
  Python, i.e. will suppress all print, even if the print originates in a
  compiled C/Fortran sub-function.
      This will not suppress raised exceptions, since exceptions are printed
  to stderr just before a script exits, and after the context manager has
  exited (at least, I think that is why it lets exceptions through).

  '''
  def __init__(self):
    # Open a pair of null files
    self.null_fds = [os.open(os.devnull, os.O_RDWR) for x in range(2)]
    # Save the actual stdout (1) and stderr (2) file descriptors.
    self.save_fds = [os.dup(1), os.dup(2)]

  def __enter__(self):
    # Assign the null pointers to stdout and stderr.
    os.dup2(self.null_fds[0], 1)
    os.dup2(self.null_fds[1], 2)

  def __exit__(self, *_):
    # Re-assign the real stdout/stderr back to (1) and (2)
    os.dup2(self.save_fds[0], 1)
    os.dup2(self.save_fds[1], 2)
    # Close the null files
    for fd in self.null_fds + self.save_fds:
      os.close(fd)


API = str(sys.argv[2]) if len(sys.argv) > 2 else "https://api.oec.world/tesseract/data.jsonrecords"
# ?cube=trade_i_baci_a_92&Exporter Country=sapry&drilldowns=Year&measures=Trade Value
default_params = {
  "cube": "trade_i_baci_a_92",
  "Exporter Country": "sapry",
  "drilldowns": "Year",
  "measures": "Trade Value",
  "seasonality_mode": "multiplicative",
  "changepoint_prior_scale": 0.05,
  "changepoint_range": 0.80,
  "start_time": 1995,
  "end_time": 2018
}
params = json.loads(sys.argv[1]) if len(sys.argv) > 1 else default_params

class PredictClass(object):

  def __init__(self, params):
    #equivalent of constructor, can do initialisation and stuff
    self.raw_df = None
    self.forecast_df = None
    self.merged_df = None
    self.params = params
    self.datadf_all = pd.DataFrame()
    self.datadf_all_moes = pd.DataFrame()

  def _filter(df, dds):
    for dd in dds:
      filter_var = "filter_{}".format(dd)
      if filter_var in params and "{} ID".format(dd) in list(df):
        df = df[df["{} ID".format(dd)].astype(str) == str(params[filter_var])]
      return df

  def filter_by_time(self):
    time_drilldown = params.get("drilldowns", "Year")
    start_time = params.get("start_time")
    end_time = params.get("end_time")
    self.raw_df = self.raw_df.loc[(self.raw_df[time_drilldown] >= int(start_time)) & (self.raw_df[time_drilldown] <= int(end_time))]

  def load_data(self):
    api_token = params.pop("apiToken", "")
    req = requests.Request("GET", API, headers={'x-tesseract-jwt-token': api_token}, params=params)
    prep = req.prepare()
    # print(json.dumps({"url": prep.url}))
    if DEBUG:
      print("\nAPI URL:\n________________\n")
      print(prep.url)
    req = requests.get(API, headers={'x-tesseract-jwt-token': api_token}, params=params)
    self.raw_df = pd.DataFrame(req.json()["data"])

  def predict(self):
    time_drilldown = params.get("drilldowns", "Year")
    seasonality_mode = params.get("seasonality_mode", "multiplicative")
    changepoint_prior_scale = params.get("changepoint_prior_scale", "0.05")
    try:
      changepoint_prior_scale = float(changepoint_prior_scale)
    except ValueError:
      changepoint_prior_scale = 0.05
    changepoint_range = params.get("changepoint_range", "0.80")
    try:
      changepoint_range = float(changepoint_range)
    except ValueError:
      changepoint_range = 0.80
    if time_drilldown == "Year":
      date_index = pd.to_datetime([f'{year}-01-31' for year in self.raw_df[time_drilldown]])
    elif time_drilldown == "Time":
      date_index = pd.to_datetime([f'{str(date)[:4]}-{str(date)[4:]}-01' for date in self.raw_df[time_drilldown]])
    else:
      date_index = pd.to_datetime([t for t in self.raw_df[time_drilldown]])
    self.raw_df["ds"] = date_index
    self.raw_df["y_orig"] = self.raw_df[self.params["measures"]].astype(float)
    self.raw_df["y"] = self.raw_df["y_orig"].round(2)
    if DEBUG:
      print("\nRaw DataFrame (head):\n________________\n")
      print(self.raw_df.head())
    model = Prophet(seasonality_mode=seasonality_mode, changepoint_prior_scale=changepoint_prior_scale, changepoint_range=changepoint_range)
    with suppress_stdout_stderr():
      model.fit(self.raw_df)
    if time_drilldown == "Year":
      future = model.make_future_dataframe(periods=10, freq='A-JAN', include_history=True)
    else:
      future = model.make_future_dataframe(periods=10*5, freq='m', include_history=True)
    if DEBUG:
      print("\nFuture DataFrame (unpopulated tail):\n________________\n")
      print(future.tail())
    self.forecast_df = model.predict(future)
    # now merge forcast with original dataframes
    self.raw_df = self.raw_df.set_index('ds')
    self.forecast_df = self.forecast_df.set_index('ds')
    self.merged_df = self.raw_df.join(self.forecast_df[['yhat', 'yhat_lower','yhat_upper', 'trend', 'trend_lower','trend_upper']], how = 'outer')
    del self.merged_df['y']
    if DEBUG:
      print("\nFuture DataFrame (unpopulated tail):\n________________\n")
      print(self.forecast_df.tail(10))
    if DEBUG:
      print("\nFuture DataFrame (last row):\n________________\n")
      print(self.forecast_df.iloc[-1])

  def stats(self):
    time_drilldown = params.get("drilldowns", "Year")
    last_observed = self.raw_df.y_orig.iloc[-1]
    last_observed_date = self.raw_df.index[-1]
    last_observed_date_loc = self.merged_df.index.get_loc(last_observed_date)
    first_predicted_date = self.merged_df.index[last_observed_date_loc + 1]
    last_observed_year = int(last_observed_date.strftime("%Y"))
    if DEBUG:
      print("last_observed", last_observed)
      print("last_observed_date", last_observed_date)
      print("last_observed_year", last_observed_year)
    # self.merged_df["pct_change"] = self.merged_df["y_orig"].fillna(self.merged_df["yhat"])
    self.merged_df["pct_change"] = self.merged_df["yhat"]
    self.merged_df["pct_change"] = self.merged_df["pct_change"].pct_change()

    self.merged_df["abs_change"] = self.merged_df["yhat"]
    self.merged_df["abs_change"] = self.merged_df["abs_change"].diff()
    if time_drilldown == "Year":
      self.merged_df["dt"] = self.merged_df.index
      self.merged_df["dt"] = self.merged_df["dt"].dt.strftime("%Y")
      self.merged_df["dt"] = self.merged_df["dt"].astype("int32")
      self.merged_df["dt"] = self.merged_df["dt"] - last_observed_year
    else:
      self.merged_df["dt"] = self.merged_df.index
      self.merged_df["dt"] = (self.merged_df["dt"] - last_observed_date) / timedelta64(1, 'M')
      self.merged_df["dt"] = self.merged_df["dt"].round()

    # self.merged_df["cagr"] = self.merged_df["yhat"]
    self.merged_df["cagr"] = self.merged_df.apply(lambda row: row["yhat"] if row.name > first_predicted_date else math.nan, axis=1)
    self.merged_df["cagr"] = self.merged_df["cagr"] / last_observed
    self.merged_df["cagr"] = self.merged_df["cagr"].pow(1. / self.merged_df["dt"])
    self.merged_df["cagr"] = self.merged_df["cagr"] - 1

    self.merged_df = self.merged_df.drop(['dt'], axis=1)

    if DEBUG:
      # clipping point for yearly
      print(self.merged_df.iloc[18:30])
      # clipping point for monthly
      # print(self.merged_df.iloc[115:125])

  def print_json(self):
    # cast date back to string (for JS processing)
    self.merged_df = self.merged_df.reset_index()
    self.merged_df["Year"] = self.merged_df["ds"].dt.strftime("%Y")
    self.merged_df["Year"] = self.merged_df["Year"].astype("int32")
    self.merged_df["ds"] = self.merged_df["ds"].dt.strftime("%Y-%m-%d")
    print(json.dumps({
      "data": json.loads(self.merged_df.to_json(orient="records")),
      "params": params
    }))


def main():
  # Now since you have self as parameter you need to create an object and then call the method for that object.
  my_prediction = PredictClass(params)
  my_prediction.load_data()
  my_prediction.filter_by_time()
  my_prediction.predict()
  my_prediction.stats()
  my_prediction.print_json()
  # print(json.dumps({"params": params}))


if __name__ == "__main__":
  main()
