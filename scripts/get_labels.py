#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import requests


def products(cube="hs92"):
    r = requests.get("https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_{}&drilldowns=HS6&measures=Trade+Value&parents=true&sparse=false".format(cube.replace("hs", "")))
    df = pd.DataFrame(r.json()["data"])

    df_concat = []

    # Generates list of sections
    df_temp = df[["Section ID", "Section"]].drop_duplicates().reset_index(drop=True)
    df_temp["value"] = df_temp["Section ID"].astype(str)
    df_temp = df_temp.rename(columns={
        "Section ID": "parent_id",
        "Section": "title"
    })
    df_temp["level"] = "Section"
    df_concat.append(df_temp)

    for level in ["HS2", "HS4", "HS6"]:
        level_id = "{} ID".format(level)
        level_number = int(level[2])
        df_temp = df[["Section ID", level, level_id]].drop_duplicates().reset_index(drop=True)
        df_temp = df_temp.rename(columns={
            "Section ID": "parent_id",
            level: "title",
            level_id: "value",
            "level": level
        })
        df_temp["label"] = df_temp["value"].astype(str).str[-level_number:]
        df_temp["level"] = level
        df_concat.append(df_temp)
    df_concat = pd.concat(df_concat, sort=False)
    df_concat.to_json("../static/members/products_{}.json".format(cube), orient="records")


def country():
    r = requests.get("https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter Country&measures=Trade+Value&parents=true&sparse=false")
    df = pd.DataFrame(r.json()["data"])
    df = df.rename(columns={
        "Continent ID": "parent_id",
        "Country ID": "value",
        "Country": "title"
    })
    df["label"] = df["value"].str[-3:]
    df = df[["parent_id", "value", "title", "label"]]
    df["level"] = "Country"
    df.to_json("../static/members/country.json", orient="records")


def technology():
    r = requests.get("https://api.oec.world/tesseract/data.jsonrecords?cube=patents_i_uspto_w_cpc&drilldowns=Subclass&measures=Patent Share&parents=true&sparse=false")
    df = pd.DataFrame(r.json()["data"])
    df_concat = []

    # Generates list of sections
    df_temp = df[["Section ID", "Section"]].drop_duplicates().reset_index(drop=True)

    for item in ["label", "value"]:
        df_temp[item] = df_temp["Section ID"]

    df_temp = df_temp.rename(columns={
        "Section ID": "parent_id",
        "Section": "title"
    })
    df_temp["level"] = "Section"
    df_concat.append(df_temp)

    for level in ["Superclass", "Class", "Subclass"]:
        level_id = "{} ID".format(level)
        df_temp = df[["Section ID", level, level_id]].drop_duplicates().reset_index(drop=True)
        df_temp = df_temp.rename(columns={
            "Section ID": "parent_id",
            level: "title",
            level_id: "label",
            "level": level
        })
        df_temp["value"] = df_temp["label"]
        df_temp["level"] = level
        df_concat.append(df_temp)
    df_concat = pd.concat(df_concat)
    df_concat.to_json("../static/members/technology.json", orient="records")

products()
products("hs96")
products("hs02")
products("hs07")
products("hs12")
country()
technology()
