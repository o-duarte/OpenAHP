import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import { capitalize } from './utils';

const Schema = mongoose.Schema;

/*
 * User schema.
 */

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  fullname: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  accountType: {
    type: String,
    enum: ['google', 'local'],
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  }
});

// The user's password is never saved in plain text.  Prior to saving the
// user model, we 'salt' and 'hash' the users password.  This is a one way
// procedure that modifies the password - the plain text password cannot be
// derived from the salted + hashed version. See 'comparePassword' to understand
// how this is used.

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Forcing title case name.
UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('fullname')) {
    return next();
  }

  user.fullname = capitalize(user.fullname);
  next();
});

// We need to compare the plain text password (submitted whenever logging in)
// with the salted + hashed version that is sitting in the database.
// 'bcrypt.compare' takes the plain text password and hashes it, then compares
// that hashed password to the one stored in the DB.  Remember that hashing is
// a one way process - the passwords are never compared in plain text form.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  callback
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    callback(err, isMatch);
  });
};

const UserModel = mongoose.model('User', UserSchema);

/*
 * Team schema.
 */

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

const TeamModel = mongoose.model('Team', TeamSchema);

/*
 * Document schema.
 */

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentType',
      default: null
    },
    content: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentContent',
      default: null
    },
    contentVersions: {
      type: [Schema.Types.ObjectId],
      ref: 'DocumentContent'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contributors: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag'
    }
  },
  {
    timestamps: true
  }
);

const DocumentModel = mongoose.model('Document', DocumentSchema);

/*
 * Document Content schema.
 */

const DocumentContentSchema = new Schema(
  {
    docOwner: {
      type: Schema.Types.ObjectId,
      ref: 'Document'
    },
    version: {
      type: String,
      default: 'beta'
    },
    description: {
      type: String,
      default: null
    },
    html: {
      type: Object,
      default: ''
    },
    raw: {
      type: Object,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const DocumentContentModel = mongoose.model(
  'DocumentContent',
  DocumentContentSchema
);

/*
 * Document Type schema.
 */

const DocumentTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const DocumentTypeModel = mongoose.model('DocumentType', DocumentTypeSchema);

/*
 * Tag schema.
 */

const TagSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const TagModel = mongoose.model('Tag', TagSchema);


/*
 * Problem schema.
 */

const Criteria = new Schema({
  name: {
    type: String,
    required: true
  },
  subCriteria: {
    type: [],
    default: [] 
  },
  matrix:{
    type: [[]],
  },
});


const AhpProblemSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    goal: {
      type: String,
      default: null
    },
    rootMatrix: {
      type: [[]],
    },
    alternatives: {
      type: [String],
    },
    priorityMethod: {
      type: Number,
    },
    consistencyMethod: {
      type: Number,
    },
    errorMeasure: {
      type: Number,
    },
    criteria: {
      type: [Criteria],
    },
    rawCriteria:{
      type: String
    },
    result: {
      type: Schema.Types.ObjectId,
      ref: 'Result',
    },
    sensitivity: {
      type: Schema.Types.ObjectId,
      ref: 'Sensitivity',
    },
    probabilistic: {
      type: Schema.Types.ObjectId,
      ref: 'Probabilistic',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastResolutionAt:{
      type: Schema.Types.Date,
    }
  },
  {
    timestamps: true
  }
);

const AhpProblemModel = mongoose.model('AhpProblem', AhpProblemSchema);

/*
 * Result schema.
 */

const ResultCriteria = new Schema({
  name: {
    type: String,
    required: true
  },
  subCriteria: {
    type: [],
    default: [] 
  },
  ranking:{
    type: [],
  },
});


const ResultSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    goal: {
      type: String,
      default: null
    },
    ranking: {
      type: [],
    },
    alternatives: {
      type: [String],
    },
    criteria: {
      type: [ResultCriteria],
    },
    
    raw:{
      type: String,
    }
  },
  {
    timestamps: true
  }
);

const ResultModel = mongoose.model('Result', ResultSchema);


/*
 * Sensitivity schema.
 */

const SensitivityCriteria = new Schema({
  name: {
    type: String,
    required: true
  },
  subCriteria: {
    type: [],
    default: [] 
  },
  weigths:{
    type: [],
  },
  rankReversal:{
    type: [[]],
  }


});


const SensitivitySchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    goal: {
      type: String,
      default: null
    },
    alternatives: {
      type: [String],
    },
    criteria: {
      type: [SensitivityCriteria],
    },
    
    raw:{
      type: String,
    }
  },
  {
    timestamps: true
  }
);

const SensitivityModel = mongoose.model('Sensitivity', SensitivitySchema, 'sensitivities');


const ProbabilisticSchema = new Schema(
  {
    alternatives: []
  }
);

const ProbabilisticModel = mongoose.model('Probabilistic', ProbabilisticSchema);



/*
 * Module exports.
 */



 
export {
  UserModel,
  UserSchema,
  TeamModel,
  TeamSchema,
  DocumentModel,
  DocumentSchema,
  DocumentContentModel,
  DocumentContentSchema,
  DocumentTypeModel,
  DocumentTypeSchema,
  TagModel,
  TagSchema,
  AhpProblemModel,
  AhpProblemSchema,
  ResultModel,
  ResultSchema,
  SensitivityModel,
  SensitivitySchema,
  ProbabilisticModel,
  ProbabilisticSchema,
};
