const fs = require('fs')

let array = [
    {
        "code": "314_1_7",
        "name": "AAMW"
    },
    {
        "code": "314_1_14",
        "name": "ACCT"
    },
    {
        "code": "314_1_23",
        "name": "ACFD"
    },
    {
        "code": "314_1_25",
        "name": "AFRC"
    },
    {
        "code": "314_1_31",
        "name": "ALAN"
    },
    {
        "code": "314_1_34",
        "name": "AMCS"
    },
    {
        "code": "314_1_401",
        "name": "AMHR"
    },
    {
        "code": "314_1_49",
        "name": "ANAT"
    },
    {
        "code": "314_1_56",
        "name": "ANCH"
    },
    {
        "code": "314_1_61",
        "name": "ANEL"
    },
    {
        "code": "314_1_63",
        "name": "ANTH"
    },
    {
        "code": "314_1_10",
        "name": "APOP"
    },
    {
        "code": "314_1_67",
        "name": "ARAB"
    },
    {
        "code": "314_1_70",
        "name": "ARCH"
    },
    {
        "code": "314_1_77",
        "name": "ARTH"
    },
    {
        "code": "314_1_80",
        "name": "ASAM"
    },
    {
        "code": "314_1_402",
        "name": "ASLD"
    },
    {
        "code": "314_1_84",
        "name": "ASTR"
    },
    {
        "code": "314_1_91",
        "name": "BCHE"
    },
    {
        "code": "314_1_403",
        "name": "BCS"
    },
    {
        "code": "314_1_95",
        "name": "BDS"
    },
    {
        "code": "314_1_98",
        "name": "BE"
    },
    {
        "code": "314_1_101",
        "name": "BENF"
    },
    {
        "code": "314_1_404",
        "name": "BENG"
    },
    {
        "code": "314_1_230",
        "name": "BEPP"
    },
    {
        "code": "314_1_105",
        "name": "BIBB"
    },
    {
        "code": "314_1_113",
        "name": "BIOE"
    },
    {
        "code": "314_1_119",
        "name": "BIOL"
    },
    {
        "code": "314_1_120",
        "name": "BIOM"
    },
    {
        "code": "314_1_126",
        "name": "BIOT"
    },
    {
        "code": "314_1_127",
        "name": "BMB"
    },
    {
        "code": "314_1_405",
        "name": "BMIN"
    },
    {
        "code": "314_1_129",
        "name": "BSTA"
    },
    {
        "code": "314_1_130",
        "name": "CAMB"
    },
    {
        "code": "314_1_131",
        "name": "CBE"
    },
    {
        "code": "314_1_147",
        "name": "CHEM"
    },
    {
        "code": "314_1_410",
        "name": "CHIC"
    },
    {
        "code": "314_1_150",
        "name": "CHIN"
    },
    {
        "code": "314_1_151",
        "name": "CIMS"
    },
    {
        "code": "314_1_154",
        "name": "CIS"
    },
    {
        "code": "314_1_156",
        "name": "CIT"
    },
    {
        "code": "314_1_20",
        "name": "CLCH"
    },
    {
        "code": "314_1_30",
        "name": "CLSC"
    },
    {
        "code": "314_1_161",
        "name": "CLST"
    },
    {
        "code": "314_1_171",
        "name": "COGS"
    },
    {
        "code": "314_1_173",
        "name": "COLL"
    },
    {
        "code": "314_1_175",
        "name": "COML"
    },
    {
        "code": "314_1_182",
        "name": "COMM"
    },
    {
        "code": "314_1_189",
        "name": "CPLN"
    },
    {
        "code": "314_1_192",
        "name": "CRIM"
    },
    {
        "code": "314_1_40",
        "name": "CRWR"
    },
    {
        "code": "314_1_412",
        "name": "CZCH"
    },
    {
        "code": "314_1_51",
        "name": "DADE"
    },
    {
        "code": "314_1_52",
        "name": "DATA"
    },
    {
        "code": "314_1_53",
        "name": "DATS"
    },
    {
        "code": "314_1_421",
        "name": "DCOH"
    },
    {
        "code": "314_1_203",
        "name": "DEMG"
    },
    {
        "code": "314_1_502",
        "name": "DEND"
    },
    {
        "code": "314_1_210",
        "name": "DENT"
    },
    {
        "code": "314_1_215",
        "name": "DIGC"
    },
    {
        "code": "314_1_506",
        "name": "DOMD"
    },
    {
        "code": "314_1_515",
        "name": "DORT"
    },
    {
        "code": "314_1_551",
        "name": "DOSP"
    },
    {
        "code": "314_1_521",
        "name": "DPED"
    },
    {
        "code": "314_1_555",
        "name": "DPRD"
    },
    {
        "code": "314_1_610",
        "name": "DRAD"
    },
    {
        "code": "314_1_54",
        "name": "DRST"
    },
    {
        "code": "314_1_59",
        "name": "DSGN"
    },
    {
        "code": "314_1_224",
        "name": "DTCH"
    },
    {
        "code": "314_1_231",
        "name": "DYNM"
    },
    {
        "code": "314_1_235",
        "name": "EALC"
    },
    {
        "code": "314_1_238",
        "name": "EAS"
    },
    {
        "code": "314_1_245",
        "name": "ECON"
    },
    {
        "code": "314_1_248",
        "name": "EDCE"
    },
    {
        "code": "314_1_55",
        "name": "EDCL"
    },
    {
        "code": "314_1_57",
        "name": "EDEN"
    },
    {
        "code": "314_1_578",
        "name": "EDHE"
    },
    {
        "code": "314_1_58",
        "name": "EDMC"
    },
    {
        "code": "314_1_62",
        "name": "EDME"
    },
    {
        "code": "314_1_64",
        "name": "EDPR"
    },
    {
        "code": "314_1_65",
        "name": "EDSC"
    },
    {
        "code": "314_1_66",
        "name": "EDSL"
    },
    {
        "code": "314_1_68",
        "name": "EDTC"
    },
    {
        "code": "314_1_845",
        "name": "EDTF"
    },
    {
        "code": "314_1_252",
        "name": "EDUC"
    },
    {
        "code": "314_1_273",
        "name": "ELP"
    },
    {
        "code": "314_1_280",
        "name": "ENGL"
    },
    {
        "code": "314_1_283",
        "name": "ENGR"
    },
    {
        "code": "314_1_287",
        "name": "ENM"
    },
    {
        "code": "314_1_301",
        "name": "ENVS"
    },
    {
        "code": "314_1_308",
        "name": "EPID"
    },
    {
        "code": "314_1_311",
        "name": "ESE"
    },
    {
        "code": "314_1_615",
        "name": "ETHC"
    },
    {
        "code": "314_1_620",
        "name": "FILP"
    },
    {
        "code": "314_1_322",
        "name": "FNAR"
    },
    {
        "code": "314_1_329",
        "name": "FNCE"
    },
    {
        "code": "314_1_336",
        "name": "FOLK"
    },
    {
        "code": "314_1_343",
        "name": "FREN"
    },
    {
        "code": "314_1_357",
        "name": "GAFL"
    },
    {
        "code": "314_1_364",
        "name": "GAS"
    },
    {
        "code": "314_1_368",
        "name": "GCB"
    },
    {
        "code": "314_1_625",
        "name": "GENC"
    },
    {
        "code": "314_1_631",
        "name": "GEND"
    },
    {
        "code": "314_1_385",
        "name": "GEOL"
    },
    {
        "code": "314_1_645",
        "name": "GLBS"
    },
    {
        "code": "314_1_234",
        "name": "GOMD"
    },
    {
        "code": "314_1_69",
        "name": "GORT"
    },
    {
        "code": "314_1_345",
        "name": "GPED"
    },
    {
        "code": "314_1_456",
        "name": "GPRD"
    },
    {
        "code": "314_1_678",
        "name": "GPRS"
    },
    {
        "code": "314_1_406",
        "name": "GREK"
    },
    {
        "code": "314_1_413",
        "name": "GRMN"
    },
    {
        "code": "314_1_423",
        "name": "GSWS"
    },
    {
        "code": "314_1_789",
        "name": "GUJR"
    },
    {
        "code": "314_1_425",
        "name": "HCIN"
    },
    {
        "code": "314_1_427",
        "name": "HCMG"
    },
    {
        "code": "314_1_431",
        "name": "HEBR"
    },
    {
        "code": "314_1_435",
        "name": "HIND"
    },
    {
        "code": "314_1_434",
        "name": "HIST"
    },
    {
        "code": "314_1_436",
        "name": "HPR"
    },
    {
        "code": "314_1_438",
        "name": "HQS"
    },
    {
        "code": "314_1_437",
        "name": "HSOC"
    },
    {
        "code": "314_1_441",
        "name": "HSPV"
    },
    {
        "code": "314_1_448",
        "name": "HSSC"
    },
    {
        "code": "314_1_912",
        "name": "HUNG"
    },
    {
        "code": "314_1_114",
        "name": "IGBO"
    },
    {
        "code": "314_1_459",
        "name": "IMPA"
    },
    {
        "code": "314_1_462",
        "name": "IMUN"
    },
    {
        "code": "314_1_116",
        "name": "INDO"
    },
    {
        "code": "314_1_111",
        "name": "INSP"
    },
    {
        "code": "314_1_481",
        "name": "INTG"
    },
    {
        "code": "314_1_483",
        "name": "INTL"
    },
    {
        "code": "314_1_490",
        "name": "INTR"
    },
    {
        "code": "314_1_497",
        "name": "INTS"
    },
    {
        "code": "314_1_500",
        "name": "IPD"
    },
    {
        "code": "314_1_117",
        "name": "IRIS"
    },
    {
        "code": "314_1_504",
        "name": "ITAL"
    },
    {
        "code": "314_1_508",
        "name": "JPAN"
    },
    {
        "code": "314_1_511",
        "name": "JWST"
    },
    {
        "code": "314_1_118",
        "name": "KAND"
    },
    {
        "code": "314_1_512",
        "name": "KORN"
    },
    {
        "code": "314_1_121",
        "name": "KSOG"
    },
    {
        "code": "314_1_514",
        "name": "LALS"
    },
    {
        "code": "314_1_518",
        "name": "LARP"
    },
    {
        "code": "314_1_525",
        "name": "LATN"
    },
    {
        "code": "314_1_532",
        "name": "LAW"
    },
    {
        "code": "314_1_71",
        "name": "LAWM"
    },
    {
        "code": "314_1_72",
        "name": "LEAD"
    },
    {
        "code": "314_1_535",
        "name": "LGIC"
    },
    {
        "code": "314_1_539",
        "name": "LGST"
    },
    {
        "code": "314_1_546",
        "name": "LING"
    },
    {
        "code": "314_1_550",
        "name": "LSMP"
    },
    {
        "code": "314_1_122",
        "name": "MALG"
    },
    {
        "code": "314_1_73",
        "name": "MAPP"
    },
    {
        "code": "314_1_560",
        "name": "MATH"
    },
    {
        "code": "314_1_74",
        "name": "MCS"
    },
    {
        "code": "314_1_567",
        "name": "MEAM"
    },
    {
        "code": "314_1_574",
        "name": "MED"
    },
    {
        "code": "314_1_588",
        "name": "MGMT"
    },
    {
        "code": "314_1_602",
        "name": "MKTG"
    },
    {
        "code": "314_1_609",
        "name": "MLA"
    },
    {
        "code": "314_1_124",
        "name": "MLYM"
    },
    {
        "code": "314_1_222",
        "name": "MMES"
    },
    {
        "code": "314_1_628",
        "name": "MPHL"
    },
    {
        "code": "314_1_100",
        "name": "MPHY"
    },
    {
        "code": "314_1_6",
        "name": "MRTI"
    },
    {
        "code": "314_1_623",
        "name": "MSCI"
    },
    {
        "code": "314_1_630",
        "name": "MSE"
    },
    {
        "code": "314_1_632",
        "name": "MSSP"
    },
    {
        "code": "314_1_76",
        "name": "MTHS"
    },
    {
        "code": "314_1_633",
        "name": "MTR"
    },
    {
        "code": "314_1_78",
        "name": "MUSA"
    },
    {
        "code": "314_1_637",
        "name": "MUSC"
    },
    {
        "code": "314_1_82",
        "name": "NANO"
    },
    {
        "code": "314_1_640",
        "name": "NELC"
    },
    {
        "code": "314_1_639",
        "name": "NETS"
    },
    {
        "code": "314_1_8",
        "name": "NEUR"
    },
    {
        "code": "314_1_641",
        "name": "NGG"
    },
    {
        "code": "314_1_642",
        "name": "NPLD"
    },
    {
        "code": "314_1_644",
        "name": "NSCI"
    },
    {
        "code": "314_1_651",
        "name": "NURS"
    },
    {
        "code": "314_1_655",
        "name": "OIDD"
    },
    {
        "code": "314_1_9",
        "name": "ORGC"
    },
    {
        "code": "314_1_682",
        "name": "PERS"
    },
    {
        "code": "314_1_686",
        "name": "PHIL"
    },
    {
        "code": "314_1_693",
        "name": "PHRM"
    },
    {
        "code": "314_1_12",
        "name": "PHYL"
    },
    {
        "code": "314_1_707",
        "name": "PHYS"
    },
    {
        "code": "314_1_13",
        "name": "PLSH"
    },
    {
        "code": "314_1_714",
        "name": "PPE"
    },
    {
        "code": "314_1_90",
        "name": "PROW"
    },
    {
        "code": "314_1_728",
        "name": "PRTG"
    },
    {
        "code": "314_1_735",
        "name": "PSCI"
    },
    {
        "code": "314_1_742",
        "name": "PSYC"
    },
    {
        "code": "314_1_745",
        "name": "PUBH"
    },
    {
        "code": "314_1_15",
        "name": "PUNJ"
    },
    {
        "code": "314_1_18",
        "name": "QUEC"
    },
    {
        "code": "314_1_749",
        "name": "REAL"
    },
    {
        "code": "314_1_200",
        "name": "REES"
    },
    {
        "code": "314_1_850",
        "name": "REG"
    },
    {
        "code": "314_1_19",
        "name": "RELC"
    },
    {
        "code": "314_1_756",
        "name": "RELS"
    },
    {
        "code": "314_1_860",
        "name": "ROBO"
    },
    {
        "code": "314_1_763",
        "name": "ROML"
    },
    {
        "code": "314_1_777",
        "name": "RUSS"
    },
    {
        "code": "314_1_780",
        "name": "SAIS"
    },
    {
        "code": "314_1_21",
        "name": "SARB"
    },
    {
        "code": "314_1_786",
        "name": "SAST"
    },
    {
        "code": "314_1_788",
        "name": "SCMP"
    },
    {
        "code": "314_1_802",
        "name": "SKRT"
    },
    {
        "code": "314_1_812",
        "name": "SOCI"
    },
    {
        "code": "314_1_819",
        "name": "SPAN"
    },
    {
        "code": "314_1_26",
        "name": "SPRO"
    },
    {
        "code": "314_1_833",
        "name": "STAT"
    },
    {
        "code": "314_1_835",
        "name": "STSC"
    },
    {
        "code": "314_1_27",
        "name": "SWAH"
    },
    {
        "code": "314_1_29",
        "name": "SWED"
    },
    {
        "code": "314_1_840",
        "name": "SWRK"
    },
    {
        "code": "314_1_32",
        "name": "TAML"
    },
    {
        "code": "314_1_333",
        "name": "TELU"
    },
    {
        "code": "314_1_36",
        "name": "THAI"
    },
    {
        "code": "314_1_861",
        "name": "THAR"
    },
    {
        "code": "314_1_39",
        "name": "TIGR"
    },
    {
        "code": "314_1_871",
        "name": "TURK"
    },
    {
        "code": "314_1_41",
        "name": "TWI"
    },
    {
        "code": "314_1_43",
        "name": "UKRN"
    },
    {
        "code": "314_1_882",
        "name": "URBS"
    },
    {
        "code": "314_1_880",
        "name": "URDU"
    },
    {
        "code": "314_1_400",
        "name": "VBMS"
    },
    {
        "code": "314_1_887",
        "name": "VCSN"
    },
    {
        "code": "314_1_888",
        "name": "VCSP"
    },
    {
        "code": "314_1_604",
        "name": "VIET"
    },
    {
        "code": "314_1_444",
        "name": "VIPR"
    },
    {
        "code": "314_1_891",
        "name": "VISR"
    },
    {
        "code": "314_1_893",
        "name": "VLST"
    },
    {
        "code": "314_1_894",
        "name": "VMED"
    },
    {
        "code": "314_1_895",
        "name": "VPTH"
    },
    {
        "code": "314_1_897",
        "name": "VSTG"
    },
    {
        "code": "314_1_899",
        "name": "VSUR"
    },
    {
        "code": "314_1_918",
        "name": "WH"
    },
    {
        "code": "314_1_920",
        "name": "WHCP"
    },
    {
        "code": "314_1_924",
        "name": "WHG"
    },
    {
        "code": "314_1_2",
        "name": "WOLF"
    },
    {
        "code": "314_1_935",
        "name": "WRIT"
    },
    {
        "code": "314_1_945",
        "name": "YDSH"
    },
    {
        "code": "314_1_605",
        "name": "YORB"
    },
    {
        "code": "314_1_125",
        "name": "ZULU"
    }
]

function convert() { 
    let arr = [] 
    array.forEach(obj => { 
        arr.push(obj.code)
    })
    fs.writeFile('Output.txt', JSON.stringify(arr), (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })
}

convert()