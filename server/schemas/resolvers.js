const {User} = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

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

        addUser: async (parent, args,)=>{
            const newUser = await User.create(args);
            const token = signToken(newUser);
            return {token, newUser};
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
        saveBook: async (parent, args, context)=>{
            if(context.user){
                const newBook = {
                    authors: args.authors,
                    description: args.description,
                    bookId: args.bookId,
                    image: args.image,
                    link: args.link,
                    title: args.title,
                }
                return await User.findByIdAndUpdate(
                { _id: context.user._id},
                { $push: { savedBooks: newBook} },
                { new: true, runValidators: true }
                );
            }else{
                throw new AuthenticationError("Not logged in");
            }
        },
        removeBook: async (parent, args, context)=>{
            if(context.user){
            return await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: {bookId: args.bookId}} },
                { new: true, runValidators: true }
                );
            }else{
                throw new AuthenticationError("Not logged in");
            }
        }
    },

};

module.exports = resolvers;