import { Document, model, Schema } from "mongoose";

interface IMap extends Document{
    id: string
    name: string,
    createdAt: Date,
    updatedAt: Date,
    path: string,
    owner: string
}

const schema = new Schema<IMap>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    path: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true,
        trim: true
    }
})

export default model<IMap>("Map", schema);