import { Document, model, Schema } from "mongoose";

interface IMap extends Document{
    id: string
    name: string,
    createdAt: Date,
    geojson: any,
    owner: string
}

const schema = new Schema<IMap>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    geojson: {
        required: true,
    },
    createdAt: {
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