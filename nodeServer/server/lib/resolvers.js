import mongoose from 'mongoose';

import { signInWithLocal, loginWithLocal } from './auth';

const User = mongoose.model('User');
const Tag = mongoose.model('Tag');
const Document = mongoose.model('Document');
const DocumentContent = mongoose.model('DocumentContent');
const AhpProblem = mongoose.model('AhpProblem');
const Result = mongoose.model('Result');
const Sensitivity = mongoose.model('Sensitivity');
const Probabilistic = mongoose.model('Probabilistic');


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
      //admin by-pass
      if(req.user.isAdmin){
        return Document.find({})
        .sort({ createdAt: -1 })
        .populate('owner')
        .populate('contributors')
        .populate('tags')
        .populate('content')
        .exec();
      }
      //normal curse

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
        return await Document.findOne({ _id: documentId, owner: req.user._id })
          .populate('owner')
          .populate('contributors')
          .populate('tags')
          .populate('content')
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    },
    currentUserProblems: (_, {statusList}, req) => {
      //add a status make this more clean
      if(statusList[0]==='all'){
        if(req.user.isAdmin){
        return AhpProblem.find({        
        })
          .sort({ createdAt: -1 })
          .populate('owner')
          .exec();
        }

        return AhpProblem.find({
          owner: req.user._id,
        })
          .sort({ createdAt: -1 })
          .populate('owner')
          .exec();
      }

      if(statusList[0]==='draft'){
        if(req.user.isAdmin){
        return AhpProblem.find({ 
           "lastResolutiondAt": {$exists: false}       
        })
          .sort({ createdAt: -1 })
          .populate('owner')
          .exec();
         }

        return AhpProblem.find({
          owner: req.user._id,
          "lastResolutionAt": {$exists: false} 
        })
          .sort({ createdAt: -1 })
          .populate('owner')
          .exec();
        }
        if(statusList[0]==='solved'){
          if(req.user.isAdmin){
          return AhpProblem.find({ 
             "lastResolutiondAt": {$exists: true}       
          })
            .sort({ createdAt: -1 })
            .populate('owner')
            .exec();
           }
  
          return AhpProblem.find({
            owner: req.user._id,
            "lastResolutionAt": {$exists: true} 
          })
            .sort({ createdAt: -1 })
            .populate('owner')
            .exec();
          }
      
    },
    currentUserSingleProblem: async (_, { problemId }, req) => {
      //admin by-pass
      if(req.user.isAdmin){
        try {
          return await AhpProblem.findOne({ _id: problemId })
            .populate('owner')
            .populate('result')
            .populate('sensitivity')
            .populate('probabilistic')
            .exec()
  
        } catch (e) {
          console.log(e.message);
        }
      }

      try {
        return await AhpProblem.findOne({ _id: problemId, owner: req.user._id })
          .populate('owner')
          .populate('result')
          .populate('sensitivity')
          .populate('probabilistic')
          .exec()

      } catch (e) {
        console.log(e.message);
      }
    },
    result: async (_, { resultId }, req) => {
      try {
        return await Result.findOne({ _id: resultId })
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    },
    sensitivity: async (_, { sensitivityId }, req) => {
      try {
        return await Sensitivity.findOne({ _id: sensitivityId })
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    },
    probabilistic: async (_, { probabilisticId }, req) => {
      try {
        return await Probabilistic.findOne({ _id: probabilisticId })
          .exec();
      } catch (e) {
        console.log(e.message);
      }
    },
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
    problemDelete: async (_, {problemId}, req) => {
      if (typeof req.user === 'undefined') {
        throw new Error('Debe iniciar sesión para ejecutar esta acción');
      }
      const prob = await AhpProblem.findOne(
        { _id: problemId }
      ).exec();
      try {
        if (typeof prob.sensitivity !== 'undefined'){
          Sensitivity.findOneAndRemove({ _id: prob.sensitivity }, function (err,offer){ if(err) { throw err; }}  )
        }
        if (typeof prob.result !== 'undefined'){
          Result.findOneAndRemove({ _id: prob.result }, function (err,offer){ if(err) { throw err; }} )
        }
        if (typeof prob.probabilistic !== 'undefined'){
          Probabilistic.findOneAndRemove({ _id: prob.probabilistic }, function (err,offer){ if(err) { throw err; }} )
        }

        return await AhpProblem.findOneAndRemove(
          { _id: problemId }
        );
      } catch (e) {
        console.log(e.message);
      }
    },
    documentDelete: async (_, {documentId}, req) => {
      if (typeof req.user === 'undefined') {
        throw new Error('Debe iniciar sesión para ejecutar esta acción');
      }
      const doc = await Document.findOne(
        { _id: documentId }
      ).exec();
      console.log(doc.content)
      try {
        if (typeof doc.content !== 'undefined'){
          DocumentContent.findOneAndRemove({ _id: doc.content }, function (err,offer){ if(err) { throw err; }}  )
        }
        return await Document.findOneAndRemove(
          { _id: documentId }
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
    problemSave: async (_, { problemId, rawData }, req ) => {
      try {
        const data = JSON.parse(rawData)
        return await AhpProblem.findOneAndUpdate(
          { _id: problemId },
          { $set: { goal: data.goal,
                    criteria: data.criteria ,
                    rawCriteria: JSON.stringify(data.criteria),
                    rootMatrix: data.rootMatrix,
                    alternatives: data.alternatives,
                     } },
          { new: true }
        ).exec();

      } catch (e) {
        console.log(e.message);
      }
    },
    updateMethods: async (_, { problemId ,consistency, error, priority, generator, beta, order }, req ) => {
      //console.log('update',consistency, error, priority)
      try {
        return await AhpProblem.findOneAndUpdate(
          { _id: problemId },
          { $set: { 
                    priorityMethod: priority,
                    consistencyMethod: consistency,
                    errorMeasure: error,
                    generator: generator,
                    beta: beta,
                    preserveRank: order,
                     } },
          { new: true }
        ).exec();

      } catch (e) {
        console.log(e.message);
      }
    },
    problemNew: async (_, {name},req) => {
      try{
        const problem = await new AhpProblem({
          name: name,
          goal: 'Objetive',
          rootMatrix: [[1,1],[1,1]],
          alternatives:  ['Alternative A','Alternative B'],
          priorityMethod: 0,
          consistencyMethod: 0,
          errorMeasure: 0,
          generator: 0,
          beta: 1,
          preserveRank: false,
          criteria: [
            {name: 'Criteria 1',
             matrix: [[1,1],[1,1]],
             subcriteria: []
            },
            {name: 'Criteria 2',
             matrix: [[1,1],[1,1]],
             subcriteria: []
            }
          ],
          rawCriteria: JSON.stringify([
            {name: 'Criteria 1',
             matrix: [[1,1],[1,1]],
             subcriteria: []
            },
            {name: 'Criteria 2',
             matrix: [[1,1],[1,1]],
             subcriteria: []
            }
          ]),
          owner: req.user
          
        }).save()
        return await AhpProblem.findOne({_id: problem.id})
                .populate('owner')
                .exec(function(err, result) {
                    if (err) return handleError(err);
                        console.log(result);
                });
      }
      catch(e){
        console.log(e.message)
      }
    }
  }
};

export default resolvers;
