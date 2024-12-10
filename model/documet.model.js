import mongoose from "mongoose";
import bcrypt from "bcrypt"

const documetSchema = new mongoose.Schema(
  {
    doc_name:{
        type: String,
        required: true
    },
    doc_id: String,
    access_code: String,
    data: {
      type:Object,
      default:""
    },
    total_users: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

documetSchema.pre("save", async function (next) {
    if(!this.isModified("access_code")) return next();
  this.access_code = await bcrypt.hash(this.access_code, 10);
});
documetSchema.methods.compareAccessCode = async function (access_code) {
  // console.log(access_code);
  return await bcrypt.compare(access_code, this.access_code);
  // return await bcrypt.compare(access_code, this.access_code);
}
const Document = mongoose.model("Documet", documetSchema);
export { Document };
