import { Document, model, Schema } from "mongoose";

export interface IMap extends Document{
    id: string
    name: string,
    createdAt: Date,
    owner: string,
    ext: string,
    log: string[]
}

const schema = new Schema<IMap>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true,
        trim: true
    },
    ext: {
        type: String
    },
    log: {
        type: [String],
        default: []
    }
})

export default model<IMap>("Map", schema);