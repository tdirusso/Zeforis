"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, body = '', isEnabled = 0, backgroundColor = '#ffffff', } = req.body;
    const { engagementId } = req;
    if (!name) {
        return res.json({
            message: 'Missing widget name.'
        });
    }
    try {
        const newWidget = yield database_1.pool.query(`INSERT INTO widgets 
        (
          engagement_id,
          name,
          body, 
          is_enabled, 
          background_color
        ) 
        VALUES
        (?,?,?,?,?)`, [engagementId, name, body, isEnabled, backgroundColor]);
        const newWidgetId = newWidget[0].insertId;
        const widgetObject = {
            id: newWidgetId,
            engagementId,
            name,
            body,
            isEnabled,
            backgroundColor
        };
        return res.json({
            success: true,
            widget: widgetObject
        });
    }
    catch (error) {
        next(error);
    }
});
