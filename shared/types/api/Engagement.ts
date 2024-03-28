import { ParamsDictionary } from "express-serve-static-core";
import { Engagement } from "../Engagement";


export type GetEngagementsForOrgRequest = {
  orgId: string;
};