const logger = require('./logger')


const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        
        return blog.likes > max.likes ? blog : max
    }
    return blogs.reduce(reducer, blogs[0])
}
const mostBlogs = (blogs) => {
    let authorCount = {}
    blogs.forEach(blog => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
    });
    const reducer = (max,author)=> {
        return authorCount[author] > max.blogs ? {"author": author,"blogs" : authorCount[author]} : max

    }
    return Object.keys(authorCount).reduce(reducer,{"author": null, "blogs": 0});
}

const mostLikes = (blogs) => {
    let authorLikes = {}
    blogs.forEach(blog => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    });
    
    const reducer = (most,author) => {
        return most.likes < authorLikes[author] ? {"author": author, "likes": authorLikes[author]} : most
    }
    return Object.keys(authorLikes).reduce(reducer,{"author":null, "likes": 0})
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}