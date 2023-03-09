const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model_nameSchema = new Schema(
  {
    name: { type: number },

    phone: {
      type: String,
      require: [true, "phone is required "],
      validate: { validator: (v) => validator.phoneValidator(v), message: (props) => `${props.value} is not a valid ` },
    },
    email: { type: String, require: [true, "email is required "], unique: true },
    password: {
      type: String,
      require: [true, "password is required "],
      min: 6,
      max: 20,
      validate: { validator: (v) => validator.passwordValidator(v), message: (props) => `${props.value} is not a valid ` },
    },
    role_id: { type: Schema.Types.ObjectId, ref: Role, require: [true, "role_id is required "] },
    is_active: { type: Boolean, require: [true, "is_active is required "] },
    createdBy: { type: Schema.Types.ObjectId },
    updatedby: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
)

module.exports = mongoose.model("model_name", model_nameSchema)
