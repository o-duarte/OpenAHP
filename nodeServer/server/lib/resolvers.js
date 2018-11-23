import mongoose from 'mongoose';

import { signInWithLocal, loginWithLocal } from './auth';

const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Document = mongoose.model('Document');
const DocumentContent = mongoose.model('DocumentContent');
const AhpProblem = mongoose.model('AhpProblem');

const resolvers = {
  Query: {
    currentUser: (_, args, req) => {
      return req.user;
    },
    currentUserDocuments: (_, args, req) => {
      const {
        statusList = ['draft', 'published', 'archived', 'contributor']
      } = args;
      console.log('currentUserDocuments called!', statusList, req.user.email);

      return Document.find({
        owner: req.user._id,
        status: { $in: statusList }
      })
        .sort({ createdAt: -1 })
        .populate('owner')
        .populate('contributors')
        .populate('tags')
        .populate('content')
        .exec();
    },
    currentUserSingleDocument: async (_, { documentId }, req) => {
      try {
        console.log(
          'currentUserSingleDocument called!',
          documentId,
          req.user.email
        );
        return await Document.findOne({ _id: documentId })
          .populate('owner')
          .populate('contributors')
          .populate('tags')
          .populate('content')
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    },
    currentUserProblems: (_, args, req) => {
      return AhpProblem.find({
        owner: req.user._id,
        //status: { $in: statusList }
      })
        .sort({ createdAt: -1 })
        .populate('owner')
        .exec();
    },
    currentUserSingleProblem: async (_, { problemId }, req) => {
      console.log(problemId)
      try {
        return await AhpProblem.findOne({ _id: problemId })
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    }
  },

  Mutation: {
    // Auth mutations.
    login: (_, { email, password }, req) => {
      return loginWithLocal({ email, password, req });
    },
    signIn: (_, { email, password, fullname }, req) => {
      return signInWithLocal({ email, password, fullname, req });
    },
    logout: (_, args, req) => {
      req.logout();
      return req.user;
    },

    // Document mutations.
    documentNew: async (_, args, req) => {
      if (typeof req.user === 'undefined') {
        throw new Error('Debe iniciar sesión para ejecutar esta acción');
      }

      console.log('documentNew called!', req.user.email);
      try {
        const doc = await new Document({ owner: req.user._id }).save();
        const docContent = await new DocumentContent({
          docOwner: doc._id
        }).save();

        return await Document.findOneAndUpdate(
          { _id: doc._id },
          {
            $set: { content: docContent._id }
          },
          { new: true }
        );
      } catch (e) {
        console.log(e.message);
      }
    },
    documentSaveContent: async (_, { documentId, title, description, html, raw }, req ) => {
      try {
        console.log('documentSaveContent called!', documentId, html);

        const doc = await Document.findOneAndUpdate(
          { _id: documentId },
          { $set: { title, description } },
          { new: true }
        ).exec();

        return await DocumentContent.findOneAndUpdate(
          { _id: doc.content },
          {
            $set: {
              html,
              raw
            }
          },
          { new: true }
        ).exec();
      } catch (e) {
        console.log(e.message);
      }
    },
    problemSave: async (_, { documentId, rawdata }, req ) => {
      try {
        const data = JSON.parse(rawdata)
        return await AhpProblem.findOneAndUpdate(
          { _id: documentId },
          { $set: { criteria: data.criteria ,
                    rootMatrix: data.rootMatrix,
                    alternatives: data.alternatives,
                     } },
          { new: true }
        ).exec();

      } catch (e) {
        console.log(e.message);
      }
    }
  }
};

export default resolvers;
