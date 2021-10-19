const {User} = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id });
      
              return userData;
            }
            throw new AuthenticationError("Not logged in");
          },
        users: ()=>{
            return User.find();
        }
    },
    Mutation: {

        addUser: (parent, args)=>{
            return User.create(args);
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError("Incorrect credentials");
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError("Incorrect credentials");
            }
      
            const token = signToken(user);
            return { token, user };
          },
        saveBook: (parent, args)=>{
            const newBook = {
                authors: args.authors,
                description: args.description,
                bookId: args.bookId,
                image: args.image,
                link: args.link,
                title: args.title,
            }
            return User.findOneAndUpdate(
            { _id: args.userID},
            { $push: { savedBooks: newBook} },
            { new: true, runValidators: true }
            );
        },
        removeBook: (parent, args)=>{
            return User.findOneAndUpdate(
                { _id: args.userID},
                { $pull: { savedBooks: {bookId: args.bookId}} },
                { new: true, runValidators: true }
                );
        }
    },

//     const token = signToken(user);
//     res.json({ token, user });
//   },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
//   async login({ body }, res) {
//     const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
//     if (!user) {
//       return res.status(400).json({ message: "Can't find this user" });
//     }
        // saveBook: (parent, args)=>{
        //     return 
        // }
};

module.exports = resolvers;