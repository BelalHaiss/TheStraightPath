const Hadith = require("../models/hadith");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/Ahadith", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongo server Running");
  })
  .catch((e) => {
    console.log("Error with the Mongo Server");
    console.log(e);
  });

const Ahadith = [
  {
    narrator: "Abdullah ebn alnaaman",
    hadith:
      "ان الحلال بيت وان الحرام بين وبينهما امور مشتبهات لا يعلمنهن كثير من الناس فمن اتقي الشبهات فقد استبرا لدينه وعرضه ومن وقع في الشبهات وقع في الحرام , كالراعي يرعي حول الحمي , يوشك ان يرتع فيها, الا وان لكل ملك حمي الا وان حمي الله محارمه , الا وان في الحسد مضغه , اذا صلحت صلح الجسد كله, واذا فسدت فسد الجسد كله : الا وهي القلب",
  },
  {
    narrator: "Abu Hurairah",
    hadith:
      "مانهيتكم عنه فاجتنبوه وما امرتكم به فاتوا منه ما استطعتم فانما اهلك الذين من قبلكم كثره مسائلهم",
  },
  {
    narrator: "Ali Ebn abitaleb",
    hadith: "من حسن اسلام المرء تركه ما لايعنيه",
  },
];
// Hadith.insertMany(Ahadith).then((msg) => console.log(msg));

Hadith.updateMany({images: [
   {  url : "https://res.cloudinary.com/belalhaiss10/image/upload/v1620646643/Hadith/ylg6e89cktcitjwd2bcn.png", filename : "Hadith/khlgsxl0eiqdty4arkr9" }, 
   {  url : "https://res.cloudinary.com/belalhaiss10/image/upload/v1620646642/Hadith/pnkvh6qk0wkkarvmmvmd.png", filename : "Hadith/khlgsxl0eiqdty4arkr9" }, 
  ]
}).then((data) =>
  console.log(data)
);
