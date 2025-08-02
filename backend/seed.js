const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-clone');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123',
        bio: 'Software Developer passionate about creating amazing web applications. Love working with React, Node.js, and modern web technologies.',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Full-stack developer with 5+ years of experience. Specialized in JavaScript, Python, and cloud technologies.',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'UI/UX Designer and Frontend Developer. Creating beautiful and functional user experiences.',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        bio: 'Backend Developer and DevOps Engineer. Expert in Node.js, Docker, and AWS.',
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'Data Scientist and Machine Learning Engineer. Passionate about AI and data-driven solutions.',
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.name}`);
    }

    // Create demo posts
    const demoPosts = [
      {
        content: "Just finished building this amazing LinkedIn clone! 🚀 It's been an incredible journey learning Next.js, Node.js, and MongoDB. The combination of modern frontend and backend technologies is truly powerful. #webdevelopment #nextjs #mongodb",
        author: createdUsers[0]._id,
      },
      {
        content: "Excited to share that I've been working on a new project using React and TypeScript. The type safety and developer experience are game-changers! What's your favorite TypeScript feature? #react #typescript #webdev",
        author: createdUsers[1]._id,
      },
      {
        content: "Design tip: Always prioritize user experience over aesthetics. A beautiful design that's hard to use is worse than a simple design that works perfectly. What's your approach to UX design? #ux #design #userexperience",
        author: createdUsers[2]._id,
      },
      {
        content: "Just deployed my first microservice to AWS! The scalability and reliability of cloud infrastructure is amazing. Learning Docker and Kubernetes has been a game-changer for my development workflow. #aws #docker #microservices",
        author: createdUsers[3]._id,
      },
      {
        content: "Machine learning is transforming how we approach problem-solving. Just implemented a recommendation system that improved user engagement by 40%! The power of data-driven decisions is incredible. #machinelearning #ai #datascience",
        author: createdUsers[4]._id,
      },
      {
        content: "Collaboration is key in software development. Working with a great team makes all the difference. What's your favorite collaboration tool? I'm a big fan of GitHub and Slack! #collaboration #teamwork #softwaredevelopment",
        author: createdUsers[0]._id,
      },
      {
        content: "The JavaScript ecosystem is evolving so rapidly! ES2023 features are making our code more readable and maintainable. What's your favorite new JavaScript feature? #javascript #es2023 #webdevelopment",
        author: createdUsers[1]._id,
      },
      {
        content: "Accessibility should be a priority, not an afterthought. Making our applications accessible to everyone is not just good practice—it's the right thing to do. How do you approach accessibility in your projects? #a11y #accessibility #inclusive",
        author: createdUsers[2]._id,
      },
    ];

    for (const postData of demoPosts) {
      const post = new Post(postData);
      await post.save();
      console.log(`Created post by: ${createdUsers.find(u => u._id.toString() === postData.author.toString()).name}`);
    }

    // Add some likes and follows
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      
      // Follow other users
      for (let j = 0; j < createdUsers.length; j++) {
        if (i !== j) {
          user.following.push(createdUsers[j]._id);
          createdUsers[j].followers.push(user._id);
        }
      }
      
      await user.save();
    }

    // Save all users with updated followers/following
    for (const user of createdUsers) {
      await user.save();
    }

    console.log('Database seeded successfully!');
    console.log('\nDemo accounts created:');
    demoUsers.forEach(user => {
      console.log(`- ${user.name}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedData(); 