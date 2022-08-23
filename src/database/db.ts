import mongoose from "mongoose";
import batteryDataModel from "../schemas/batterySchema.js";
export default class Db {
    constructor(address: string) {
        mongoose.connect(process.env.databaseAddress).then(() => console.log('connected')).catch((err) => console.log(err));
    }
    public async getLogs() {
        try {
            const currentTime = Date.now()
            //gets all singed In documents
            const res = await batteryDataModel.find();
            let finalDocs = [];
            //for every battery signed in, add it to the final values list ONLY if its only been signed back in for under 2 hours
            for (let doc in res) {
                if (currentTime - Date.parse(res[doc].timeIn) <= parseInt(process.env.logLength) * 3600000 || currentTime - Date.parse(res[doc].timeOut) <= parseInt(process.env.logLength) * 3600000) {
                    finalDocs.push(res[doc])
                }
            }
            //returns an array of all docs that meet this requirement. 
            return finalDocs;
        } catch (e) {
            console.error(e);
        }
    }

    public async getSingedIn() {
        try {
            const currentTime = Date.now()
            //gets all singed In documents
            const res = await batteryDataModel.find({ signedOut: false });
            let finalDocs = [];
            //for every battery signed in, add it to the final values list ONLY if its only been signed back in for under 2 hours
            for (let doc in res) {
                if (currentTime - Date.parse(res[doc].timeIn) <= 7200000) {
                    finalDocs.push(res[doc])
                }
            }
            //returns an array of all docs that meet this requirement. 
            return finalDocs;
        } catch (e) {
            console.error(e);
        }
    }

    public async isSignedOut(batteryNumber: number) {
        try {
            let res = await batteryDataModel.findOne({ batteryNumber: batteryNumber, signedOut: true })
            res == null ? res = false : res = true;
        } catch (e) {
            console.error(e)
        }
    }

    public async listSingedOut() {
        try {
            return await batteryDataModel.find({ signedOut: true });
        } catch (e) {
            console.error(e);
        }
    }
    public async submitData({ bNum, rintBefore, socBefore, rintAfter, socAfter, purpose, subgroup }: { bNum: number, rintBefore?: number, socBefore?: number, rintAfter?: number, socAfter?: number, purpose?: string, subgroup?: string }) {
        try {
            let res = await batteryDataModel.findOne({ batteryNumber: bNum, signedOut: true });
            let doc: { timeOut: string; signedOut: boolean; timeIn: string; batteryNumber: number; beakBefore: { rint: number; soc: number; }; beakAfter: { rint: number; soc: number; }; purpose: string; subgroup: string; updated: boolean; save: () => void; };
            if (res == null) {
                doc = new batteryDataModel()
                doc.timeOut = new Date().toString();
                doc.signedOut = true;
            } else {
                doc = res;
                doc.timeIn = new Date().toString();
                doc.signedOut = false;
            }
            doc.batteryNumber = bNum;
            //if null or undefined isn't passed into the function, then it will change the values of the doc to match what was passed in
            if (rintBefore != null && rintBefore != undefined) {
                doc.beakBefore.rint = rintBefore;
            }

            if (socBefore != null && socBefore != undefined) {
                doc.beakBefore.soc = socBefore;
            }

            if (rintAfter != null && rintAfter != undefined) {
                doc.beakAfter.rint = rintAfter;
            }

            if (socAfter != null && socAfter != undefined) {
                doc.beakAfter.soc = socAfter;
            }

            if (purpose != null && purpose != undefined) {
                doc.purpose = purpose;
            }

            if (subgroup != null && subgroup != undefined) {
                doc.subgroup = subgroup;
            }
            //sets updated state of doc to false so it will be updated by sync function
            doc.updated = false;
            doc.save();
        } catch (e) {
            console.error(e);
        }
    }
}