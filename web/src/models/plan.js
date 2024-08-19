import prismaClient from "../db/prisma/index.js";
import { Shop } from "./Shop.js";
import { DEFAULT_PLANS_OBJ } from "../constants/index.js";

export class Plan {
  static async create(details) {
    const new_plan_detail = await prismaClient.plan.create({
      data: details,
    });
    if (!new_plan_detail) {
      throw new Error("Error creating plan detail");
    }
    return new_plan_detail;
  }

  static async getAll() {
    const plans = await prismaClient.plan.findMany({});
    if (plans.length === 0) {
      await this.createDefaultPlans();
      return this.getAll();
    }
    return plans;
  }

  static async getByType(type) {
    const plan = await prismaClient.plan.findFirst({
      where: {
        type,
      },
    });

    return plan;
  }

  static async getById(id) {
    const plan = await prismaClient.plan.findUnique({
      where: {
        id,
      },
    });

    return plan;
  }

  static async update(plan_data) {
    const updated_plan_detail = await prismaClient.plan.update({
      where: { id: plan_data.id },
      data: plan_data,
    });

    if (!updated_plan_detail) {
      throw new Error(`The plan with id ${plan_data.id} could not be found`);
    }
    return updated_plan_detail;
  }

  static async createDefaultPlans() {
    const plans = await prismaClient.plan.createMany({
      data: DEFAULT_PLANS_OBJ,
    });

    return plans;
  }
}
