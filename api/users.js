const {
  CANON_STRIPE_HOOK,
  CANON_STRIPE_PROD,
  CANON_STRIPE_SECRET
} = process.env;

const stripe = require("stripe")(CANON_STRIPE_SECRET);
const bodyParser = require("body-parser");

const isRole = role => (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role >= role) return next();
    else res.status(401).send("user does not have sufficient privileges");
  }
  return res.status(401).send("not logged in");
};

module.exports = function(app) {

  const {db} = app.settings;

  const stripeUser = async(req, res, next) => {
    const {id, email, name, socialEmail} = req.user;
    let customer;
    if (req.user.stripe) {
      customer = await stripe.customers
        .retrieve(req.user.stripe)
        .catch(err => {
          console.error(`\nUnable to retrieve Stripe account for user id: ${id}\n${err}\n`);
          return undefined;
        });
    }
    if (!req.user.stripe) {
      customer = await stripe.customers
        .create({
          email: email || socialEmail,
          name
        })
        .catch(err => {
          console.error(`\nUnable to create Stripe account for user id: ${id}\n${err}\n`);
          return undefined;
        });
    }
    req.stripeUser = customer;
    const user = await db.users.findOne({where: {id}});
    if (customer) user.stripe = customer.id;
    if (customer && !user.status) user.status = "intrigued";
    await user.save();
    next();
  };

  app.get("/auth/checkout", isRole(0), stripeUser, async(req, res) => {

    const {connection, headers, i18n, stripeUser} = req;
    const origin = `http${connection.encrypted ? "s" : ""}://${headers.host}/${i18n.language}`;

    const config = {
      customer: stripeUser.id,
      payment_method_types: ["card"],
      subscription_data: {
        items: [{plan: CANON_STRIPE_PROD}]
      },
      success_url: `${origin}/account`,
      cancel_url: `${origin}/account`
    };

    const session = await stripe.checkout.sessions
      .create(config)
      .catch(error => ({error}));

    res.json(session);

  });

  app.get("/auth/stripe/user", isRole(1), stripeUser, async(req, res) => {

    const user = req.stripeUser;

    const invoices = await stripe.invoices.list({customer: req.user.stripe})
      .then(resp => resp.data)
      .catch(() => []);

    res.json({invoices, user});

  });

  app.post("/auth/stripe/hooks", async(req, res) => {

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, CANON_STRIPE_HOOK);
    }
    catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const {customer} = event.data.object;
    const user = await db.users.findOne({where: {stripe: customer}});

    /** Changes user role to 0 */
    async function demoteUser(status) {
      user.status = status;
      user.role = user.role === 1 ? 0 : user.role;
      await user.save();
    }

    if (user) {

      switch (event.type) {
        case "customer.subscription.updated":
          const {status} = event.data.object;
          switch (status) {
            case "active":
              user.status = "subscribed";
              user.role = user.role < 1 ? 1 : user.role;
              await user.save();
              break;
            case "past_due":
            case "unpaid":
            case "canceled":
              demoteUser(event.type);
              break;
            default:
              break;
          }
          break;
        case "customer.subscription.deleted":
          demoteUser("deleted");
          break;
        default:
          break;
      }

    }
    else {
      console.error(`Unable to locate stripe user ${customer}`);
    }

    res.json({received: true});
  });

};
