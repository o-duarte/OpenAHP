import mongoose from 'mongoose';
import casual from 'casual';

// Schemas.
const User = mongoose.model('User');
const Team = mongoose.model('Team');
const Tag = mongoose.model('Tag');
const Document = mongoose.model('Document');
const DocumentContent = mongoose.model('DocumentContent');

// Base mock data.
var tags = casual.array_of_words(20);
var teams = casual.sentences(10).split('.');

tags = tags.map(word =>
  titleCase(word + ' ' + casual.words(Math.random() * 2))
);
teams = teams.map(word => titleCase(word));
/*
 * Utils functions.
 */

function randomize(array, n) {
  var final = [];
  array = array
    .filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    })
    .sort(function() {
      return 0.5 - Math.random();
    });

  var len = array.length,
    n = n > len ? len : n;

  for (var i = 0; i < n; i++) {
    final[i] = array[i];
  }

  return final;
}

function upperCase(str) {
  return str.toUpperCase();
}
function titleCase(str) {
  var firstLetterRx = /(^|\s)[a-z]/g;
  return str.replace(firstLetterRx, upperCase);
}

/*
 * Insert functions.
 */

const createTags = async () => {
  tags.map(async tag => {
    const newTag = new Tag({ name: tag, description: casual.description });

    try {
      await newTag.save();
      console.log(`Tag added:${newTag}`);
    } catch (e) {
      console.log(e.message);
    }
  });
};

const createTeams = async () => {
  teams.map(async team => {
    const newTeam = new Team({ name: team, description: casual.description });

    try {
      await newTeam.save();
      console.log(`Team added:${newTeam}`);
    } catch (e) {
      console.log(e.message);
    }
  });
};

const createUsers = async () => {
  for (let i = 0; i < 5; i++) {
    const teamList = await Team.find().select('_id');
    const teamId = randomize(teamList.map(i => i._id), 1);

    const user = new User({
      email: casual.email.toLowerCase(),
      password: '1234',
      fullname: casual.full_name,
      accountType: 'local',
      team: teamId[0]
    });

    try {
      await user.save();
      console.log(`User added: ${user}`);
    } catch (e) {
      console.log(e.message);
    }
  }
};

const createDocuments = async () => {
  const user = await User.findOne({ email: 'me@asdf.com' }).select('_id');

  for (let i = 0; i < 5; i++) {
    const doc = new Document({
      owner: user._id
    });

    try {
      const newDoc = await doc.save();

      const content = new DocumentContent({
        docOwner: newDoc._id,
        html: `<h1>${casual.title}</h1><p>${casual.words(
          80
        )}</p><p>${casual.words(100)}</p>`
      });

      newDoc.content = content;
      await doc.save();

      await content.save();
      console.log(`Doc added: ${doc}`);
    } catch (e) {
      console.log(e.message);
    }
  }
};

/*
 * Mocking execution.
 */

const mockData = async () => {
  // await Team.remove().exec();
  // await Tag.remove().exec();
  // await Document.remove().exec();
  // await DocumentContent.remove().exec();
  // await User.remove().exec();
  // await createTeams();
  // await createTags();
  // await createUsers();
  // await createDocuments();
};

export default mockData;
