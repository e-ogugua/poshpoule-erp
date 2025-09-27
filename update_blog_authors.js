const fs = require('fs');
const path = require('path');

// Read the data file
const dataPath = path.join(__dirname, 'db', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Map of old author names to new author IDs
const authorMapping = {
  'Emmanuel Ogugua': 'author-emmanuel',
  'Chidera Ogugua': 'author-chidera',
  'Chikwado Ezike': 'author-chikwado',
  'PoshPOULE Heritage Team': 'team-heritage',
  'PoshPOULE Science Team': 'team-science',
  'PoshPOULE Team': 'team-poshpoule'
};

// Update each blog post
if (data.blogPosts && Array.isArray(data.blogPosts)) {
  data.blogPosts.forEach(post => {
    if (post.author) {
      // If the author exists in our mapping, replace it with the new structure
      if (authorMapping[post.author]) {
        post.authorId = authorMapping[post.author];
        delete post.author;
      } else {
        // Default to PoshPOULE Team if author not found in mapping
        console.warn(`Author "${post.author}" not found in mapping, defaulting to PoshPOULE Team`);
        post.authorId = 'team-poshpoule';
        delete post.author;
      }
    }
  });
}

// Write the updated data back to the file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Blog post authors updated successfully!');
