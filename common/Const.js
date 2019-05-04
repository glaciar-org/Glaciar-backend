
// based on:
// https://stackoverflow.com/questions/8595509/how-do-you-share-define(nts-in-nodejs-modules
// https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

'use strict'

let Consts = {
    TYPE_CSV: 'csv',
    TYPE_JSON: 'json',                              // :  Esto es chart.js (sin angular) y lo mismo que json_x_chartjs_s

    TYPE_JSON_for_CHARTJS_S: 'json_x_chartjs_s',    // :  Esto es chart.js (sin angular) y lo mismo que json_x
    TYPE_JSON_for_CHARTJS_M: 'json_x_chartjs_m',    // :  Esto es chart.js (sin angular) multiple, que no lo tengo en el front-end

    // TYPE_JSON_for_NG2_CHARTS_S: 'json_x_ng2-charts_s',    // :  Esto es ng2-charts (con angular) simple,   que no lo tengo en el backend
    // TYPE_JSON_for_NG2_CHARTS_M: 'json_x_ng2-charts_m',    // :  Esto es ng2-charts (con angular) multiple, que no lo tengo en el backend
    TYPE_JSON_for_CHARTJS_MULTI_SERIES : 'json_x_chartjs_multi_series',


    TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1 : 'json_x_amcharts4_multi_series',
    TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2 : 'json_x_amcharts4_multi_series_v2',   // Idem V1, pero procesada
    TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3 : 'json_x_amcharts4_multi_series_v3',   // Idem V2, pero paso tambien los nombres
    
    TYPE_JSON_for_HIGHSTOCK: 'json_x_highstock',

    ZOOM_DD    : 'DD',
    ZOOM_MM    : 'MM',
    ZOOM_YYYY  : 'YYYY',

    // export enum VAR {
    VAR: {
        CO    : 'CO',
        CO2   : 'CO2',
        NO    : 'NO',
        NO2   : 'NO2',
        
        Temp  : 'Temp',
        pH    : 'pH',
        OD    : 'OD',
        Redox : 'Redox',
        Cond  : 'Cond',

        WorkInProgress : 'WIP',
    },

    DS_TYPE: {

        TODOS         : 'TODOS',

        PARAM_SECTOR_Electricity    : 'Electricity',
        PARAM_SECTOR_Construction   : 'Construction',
        PARAM_SECTOR_Transportation : 'Transportation',
        PARAM_SECTOR_Other          : 'Other',

        PARAM_COUNTRY_Argentina     : 'Argentina',
        PARAM_COUNTRY_Germany       : 'Germany',
        PARAM_COUNTRY_Chile         : 'Chile',
        PARAM_COUNTRY_Bolivia       : 'Bolivia',
        PARAM_COUNTRY_Brazil        : 'Brazil',
    },

    // EMULO: export enum DS_NAME {
    DS_NAME: {
        DS01    : 'MGSET_01_2009_2018',
        DS02    : 'MGSET_02_2010_2015',
        DS03    : 'MGSET_03_2015_2017',
        DS04    : 'MGSET_04_2010_2015-PRN',
        DS05_a  : 'MGSET_05_WRI_CAIT_EESS_CO2',
        DS05_b  : 'MGSET_05_WRI_CAIT_ETOT_CO2',
        
        // Estaciones 
        DS01_BO : 'MGSET_01_2009_2018_BO',
        DS01_PA : 'MGSET_01_2009_2018_PA',
        DS01_CO : 'MGSET_01_2009_2018_CO',
        DS01_CE : 'MGSET_01_2009_2018_CE',

        // DS04: Estaciones
        DS04_PRN : 'DATASET-PRN-{{param}}',
        DS04_GGY : 'DATASET-GGY-{{param}}',
        DS04_PGY : 'DATASET-PGY-{{param}}',

        // DS05: Sectores
        DS05_SECTOR_Electricity    : 'WRI_CAIT_EESS_CO2_{{country}}_Electricity',
        DS05_SECTOR_Construction   : 'WRI_CAIT_EESS_CO2_{{country}}_Construction',
        DS05_SECTOR_Transportation : 'WRI_CAIT_EESS_CO2_{{country}}_Transportation',
        DS05_SECTOR_Other          : 'WRI_CAIT_EESS_CO2_{{country}}_Other',

        // DS05: countries
        DS05_COUNTRY_Argentina     : 'WRI_CAIT_EESS_CO2_Argentina_{{sector}}',
        DS05_COUNTRY_Germany       : 'WRI_CAIT_EESS_CO2_Germany_{{sector}}',
        DS05_COUNTRY_Chile         : 'WRI_CAIT_EESS_CO2_Chile_{{sector}}',
        DS05_COUNTRY_Bolivia       : 'WRI_CAIT_EESS_CO2_Bolivia_{{sector}}',
        DS05_COUNTRY_Brazil        : 'WRI_CAIT_EESS_CO2_Brazil_{{sector}}',
    },

    // emulo: export enum AIRQ
    AIRQ: {
        CO      : 'AIRQ_CO',
        CO2     : 'AIRQ_CO2',
        NO      : 'AIRQ_NO',
        NO2     : 'AIRQ_NO2',
    },
    
    // emulo: export enum WATERQ
    WATERQ: {
        Temp    : 'WATERQ_Temp',
        pH      : 'WATERQ_pH',
        OD      : 'WATERQ_OD',
        Redox   : 'WATERQ_Redox',
        Cond    : 'WATERQ_Cond',
    },

}

module.exports = Object.freeze(Consts);




// Nota:

// TYPE_JSON_for_CHARTJS_S
// TYPE_JSON_for_CHARTJS_M
//      https://codepen.io/k3no/pen/pbYGVa?editors=1010

// TYPE_JSON_for_NG2_CHARTS_M
//      https://valor-software.com/ng2-charts/

