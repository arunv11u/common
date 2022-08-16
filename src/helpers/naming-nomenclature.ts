import { UniqueNamingTypes } from "../interfaces";

export interface BaseNamingNomenclatureHelper {
    getUniqueIdentifier(uniqueNamingTypes: UniqueNamingTypes, isYearNeeded: boolean, identifierLength: number, lastIdentifier?: string): string;
};

export class NamingNomenclatureHelper implements BaseNamingNomenclatureHelper {

    private static _instance: NamingNomenclatureHelper;
    private constructor() { };

    static getInstance(): BaseNamingNomenclatureHelper {
        if (!NamingNomenclatureHelper._instance) NamingNomenclatureHelper._instance = new NamingNomenclatureHelper();

        return NamingNomenclatureHelper._instance;
    };


    getUniqueIdentifier(uniqueNamingType: UniqueNamingTypes, isYearNeeded: boolean, identifierLength: number, lastIdentifier?: string): string {
        
        let uniqueNumber = "";

        // Year calc
        let year = "";
        if (isYearNeeded) year = new Date().getFullYear().toString();

        let uniqueNumberLength = (identifierLength-(uniqueNamingType.length + year.length));

        console.log("uniqueNumberLength :::", uniqueNumberLength);
        // Last identifier calc
        if(!lastIdentifier) {
            for(let counterIndex=0; counterIndex < uniqueNumberLength; counterIndex++) {
                uniqueNumber += "0";
            };

            console.log("uniqueNumber if cond :: :::", uniqueNumber);

            return `${uniqueNamingType}${year}${uniqueNumber}`;
        } else {
            let modNumber = parseInt(lastIdentifier.split(uniqueNamingType)[1]);
            console.log("modNumber :: before inc :", modNumber);

            modNumber++;
            console.log("modNumber :: after inc :", modNumber);

            uniqueNumber = modNumber.toString().padStart(uniqueNumberLength, "0");
            console.log("uniqueNumber else :::::", uniqueNumber);

            return `${uniqueNamingType}${uniqueNumber}`;
        };
    };
};
