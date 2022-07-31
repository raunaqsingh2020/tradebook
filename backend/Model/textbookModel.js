const mongoose = require("mongoose");
const validator = require("validator");


const textUsersSchema = new mongoose.Schema({
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Textbook must be provided by a user"],
    },
    price: {
      type: Number,
      required: [true, "You must have a price set for textbook"],
    },
    note: {
      type: String,
    },
  });

const textbookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Your textbook must have a name"],
    },
    dept: {
      type: [
        {
          type: String,
          enum: ["AAMW","ACCT","ACFD","AFRC","ALAN","AMCS","AMHR","ANAT","ANCH","ANEL","ANTH","APOP","ARAB","ARCH","ARTH","ASAM","ASLD","ASTR","BCHE","BCS","BDS","BE","BENF","BENG","BEPP","BIBB","BIOE","BIOL","BIOM","BIOT","BMB","BMIN","BSTA","CAMB","CBE","CHEM","CHIC","CHIN","CIMS","CIS","CIT","CLCH","CLSC","CLST","COGS","COLL","COML","COMM","CPLN","CRIM","CRWR","CZCH","DADE","DATA","DATS","DCOH","DEMG","DEND","DENT","DIGC","DOMD","DORT","DOSP","DPED","DPRD","DRAD","DRST","DSGN","DTCH","DYNM","EALC","EAS","ECON","EDCE","EDCL","EDEN","EDHE","EDMC","EDME","EDPR","EDSC","EDSL","EDTC","EDTF","EDUC","ELP","ENGL","ENGR","ENM","ENVS","EPID","ESE","ETHC","FILP","FNAR","FNCE","FOLK","FREN","GAFL","GAS","GCB","GENC","GEND","GEOL","GLBS","GOMD","GORT","GPED","GPRD","GPRS","GREK","GRMN","GSWS","GUJR","HCIN","HCMG","HEBR","HIND","HIST","HPR","HQS","HSOC","HSPV","HSSC","HUNG","IGBO","IMPA","IMUN","INDO","INSP","INTG","INTL","INTR","INTS","IPD","IRIS","ITAL","JPAN","JWST","KAND","KORN","KSOG","LALS","LARP","LATN","LAW","LAWM","LEAD","LGIC","LGST","LING","LSMP","MALG","MAPP","MATH","MCS","MEAM","MED","MGMT","MKTG","MLA","MLYM","MMES","MPHL","MPHY","MRTI","MSCI","MSE","MSSP","MTHS","MTR","MUSA","MUSC","NANO","NELC","NETS","NEUR","NGG","NPLD","NSCI","NURS","OIDD","ORGC","PERS","PHIL","PHRM","PHYL","PHYS","PLSH","PPE","PROW","PRTG","PSCI","PSYC","PUBH","PUNJ","QUEC","REAL","REES","REG","RELC","RELS","ROBO","ROML","RUSS","SAIS","SARB","SAST","SCMP","SKRT","SOCI","SPAN","SPRO","STAT","STSC","SWAH","SWED","SWRK","TAML","TELU","THAI","THAR","TIGR","TURK","TWI","UKRN","URBS","URDU","VBMS","VCSN","VCSP","VIET","VIPR","VISR","VLST","VMED","VPTH","VSTG","VSUR","WH","WHCP","WHG","WOLF","WRIT","YDSH","YORB","ZULU"], //should there be a group
        },
      ],
      required: [true, "Your textbook must have a dept associated with it"],
    },
    dept_code: {
        type: [
            {
              type: String,
              enum: ["314_1_7","314_1_14","314_1_23","314_1_25","314_1_31","314_1_34","314_1_401","314_1_49","314_1_56","314_1_61","314_1_63","314_1_10","314_1_67","314_1_70","314_1_77","314_1_80","314_1_402","314_1_84","314_1_91","314_1_403","314_1_95","314_1_98","314_1_101","314_1_404","314_1_230","314_1_105","314_1_113","314_1_119","314_1_120","314_1_126","314_1_127","314_1_405","314_1_129","314_1_130","314_1_131","314_1_147","314_1_410","314_1_150","314_1_151","314_1_154","314_1_156","314_1_20","314_1_30","314_1_161","314_1_171","314_1_173","314_1_175","314_1_182","314_1_189","314_1_192","314_1_40","314_1_412","314_1_51","314_1_52","314_1_53","314_1_421","314_1_203","314_1_502","314_1_210","314_1_215","314_1_506","314_1_515","314_1_551","314_1_521","314_1_555","314_1_610","314_1_54","314_1_59","314_1_224","314_1_231","314_1_235","314_1_238","314_1_245","314_1_248","314_1_55","314_1_57","314_1_578","314_1_58","314_1_62","314_1_64","314_1_65","314_1_66","314_1_68","314_1_845","314_1_252","314_1_273","314_1_280","314_1_283","314_1_287","314_1_301","314_1_308","314_1_311","314_1_615","314_1_620","314_1_322","314_1_329","314_1_336","314_1_343","314_1_357","314_1_364","314_1_368","314_1_625","314_1_631","314_1_385","314_1_645","314_1_234","314_1_69","314_1_345","314_1_456","314_1_678","314_1_406","314_1_413","314_1_423","314_1_789","314_1_425","314_1_427","314_1_431","314_1_435","314_1_434","314_1_436","314_1_438","314_1_437","314_1_441","314_1_448","314_1_912","314_1_114","314_1_459","314_1_462","314_1_116","314_1_111","314_1_481","314_1_483","314_1_490","314_1_497","314_1_500","314_1_117","314_1_504","314_1_508","314_1_511","314_1_118","314_1_512","314_1_121","314_1_514","314_1_518","314_1_525","314_1_532","314_1_71","314_1_72","314_1_535","314_1_539","314_1_546","314_1_550","314_1_122","314_1_73","314_1_560","314_1_74","314_1_567","314_1_574","314_1_588","314_1_602","314_1_609","314_1_124","314_1_222","314_1_628","314_1_100","314_1_6","314_1_623","314_1_630","314_1_632","314_1_76","314_1_633","314_1_78","314_1_637","314_1_82","314_1_640","314_1_639","314_1_8","314_1_641","314_1_642","314_1_644","314_1_651","314_1_655","314_1_9","314_1_682","314_1_686","314_1_693","314_1_12","314_1_707","314_1_13","314_1_714","314_1_90","314_1_728","314_1_735","314_1_742","314_1_745","314_1_15","314_1_18","314_1_749","314_1_200","314_1_850","314_1_19","314_1_756","314_1_860","314_1_763","314_1_777","314_1_780","314_1_21","314_1_786","314_1_788","314_1_802","314_1_812","314_1_819","314_1_26","314_1_833","314_1_835","314_1_27","314_1_29","314_1_840","314_1_32","314_1_333","314_1_36","314_1_861","314_1_39","314_1_871","314_1_41","314_1_43","314_1_882","314_1_880","314_1_400","314_1_887","314_1_888","314_1_604","314_1_444","314_1_891","314_1_893","314_1_894","314_1_895","314_1_897","314_1_899","314_1_918","314_1_920","314_1_924","314_1_2","314_1_935","314_1_945","314_1_605","314_1_125"]
            },
          ],
    },
    course_number_code: {
        type: Number,
        required: [true, "Your textbook must have a course associated with it"],
    }, 
    session_number_codes: {
        type: [
            {
              type: Number,
            },
          ],
        default: []
    },
    market_price: {
      type: Number,
    },
    rating: { 
        type: Number,
        max: 5,
        min: 0
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Textbook must be provided by a user"],
    },
    price: {
      type: Number,
      required: [true, "You must have a price set for textbook"],
    },
    note: {
      type: String,
    },
    sold: { 
      type: Boolean, 
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Might have to create index here! name, owner needs to be unique.

// dishSchema.virtual("orders", {
//   ref: "Order",
//   foreignField: "dish",
//   localField: "_id",
// });

// dishSchema.post("save", (doc, next) => {

//   next();
// });

const Textbook = mongoose.model("Textbook", textbookSchema);

module.exports = Textbook;