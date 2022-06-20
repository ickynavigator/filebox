import type { FileModelType, IFile } from '>types/File';
import mongoose from 'mongoose';

/* FileSchema will correspond to a collection in your MongoDB database. */
const FileSchema = new mongoose.Schema<IFile>({
  name: {
    /* The name of this file */

    type: String,
    required: [true, 'Please provide a name for this file.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    /* A description of this file */

    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  url: {
    /* The url for this file */

    type: String,
    required: [true, 'Please provide the file url'],
  },
});

const File: FileModelType =
  mongoose.models.File || mongoose.model('File', FileSchema);

export default File;
