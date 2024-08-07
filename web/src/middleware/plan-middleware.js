export function planMiddleware(plans) {
  return async (req, res, next) => {
    const shop = req.shop;

    const plan_id = shop.plan_id;

    if (!plan_id)
      return res.status(401).send({ error: "You need to subscribe a plan" });

    const planType = shop.plan.type;

    if (!plans.includes(planType))
      return res.status(401).send({
        error:
          "Please consider upgrade your plan. You cannot perform such actions with that plan",
      });

    return next();
  };
}
