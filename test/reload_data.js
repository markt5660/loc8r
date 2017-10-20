use Loc8r

// Fig Tree
db.locations.deleteMany({'name' : 'Fig Tree Coffee'})
db.locations.save({
  name: 'Fig Tree Coffee',
  address: '222 Vernon St, Roseville, CA 95678',
  rating: 4,
  facilities: ['Hot Drinks','Pastries','Good wifi'],
  coords: [-121.2856716, 38.74965],
  hours: [{
    fromDay: 'Monday',
    toDay: 'Friday',
    open: '6:30am',
    close: '10:00pm'
  }, {
    fromDay: 'Saturday',
    toDay: '',
    open: '8:00am',
    close: '10:00pm'
  }, {
    fromDay: 'Sunday',
    toDay: '',
    open: '',
    close: ''
  }]
})
db.locations.update({
  name:'Fig Tree Coffee'
}, {
  $push: {
    reviews: {
      author: 'Nicholas',
      _id: ObjectId(),
      rating: 4,
      text: 'Great coffee. Great service. Awesome, relaxing environment to hang out and catch up with friends.',
      createdOn: new Date('Sep 30, 2017')
    }
  }
})

// Cheese Louise
db.locations.deleteMany({'name' : 'Cheese Louise'})
db.locations.save({
  name: 'Cheese Louise',
  address: '400 Vernon St, Roseville, CA 95678',
  rating: 4,
  facilities: ['Hot Drinks','Hot Sandwiches','Average wifi'],
  coords: [-121.2877046, 38.7480773],
  hours: [{
    fromDay: 'Monday',
    toDay: 'Friday',
    open: '7:00am',
    close: '6:00pm'
  }, {
    fromDay: 'Saturday',
    toDay: '',
    open: '9:00am',
    close: '3:00pm'
  }, {
    fromDay: 'Sunday',
    toDay: '',
    open: '',
    close: ''
  }]
})
db.locations.update({
  name:'Cheese Louise'
}, {
  $push: {
    reviews: {
      author: 'Dlorah',
      _id: ObjectId(),
      rating: 4,
      text: 'This is a very good place to eat with unique and very delicious sandwiches.',
      createdOn: new Date('Oct 5, 2017')
    }
  }
})
db.locations.update({
  name:'Cheese Louise'
}, {
  $push: {
    reviews: {
      author: 'Lindy',
      _id: ObjectId(),
      rating: 5,
      text: 'This place is so good! Food is amazing as well as customer service! You won\'t be disappointed.',
      createdOn: new Date('Aug 12, 2017')
    }
  }
})

// Shady Coffee and Tea
db.locations.deleteMany({'name' : 'Shady Coffee and Tea'})
db.locations.save({
  name: 'Shady Coffee and Tea',
  address: '325 Douglas Blvd, Roseville, CA 95678',
  rating: 5,
  facilities: ['Hot Drinks','Pastries','Premium wifi'],
  coords: [-121.2897514, 38.7441655],
  hours: [{
    fromDay: 'Monday',
    toDay: 'Saturday',
    open: '7:00am',
    close: '10:00pm'
  }, {
    fromDay: 'Sunday',
    toDay: '',
    open: '7:00am',
    close: '6:00pm'
  }]
})
db.locations.update({
  name:'Shady Coffee and Tea'
}, {
  $push: {
    reviews: {
      author: 'Lindy',
      _id: ObjectId(),
      rating: 5,
      text: 'The hobbit hole is a perfect dark and quiet space to study alone, and their outdoor seating is very cozy. Great coffee and food, and open mic night is always fun to attend.',
      createdOn: new Date('Oct 13, 2017')
    }
  }
})

// Starbucks
db.locations.deleteMany({'name' : 'Starbuck\'s'})
db.locations.save({
  name: 'Starbuck\'s',
  address: '415 Roseville Square A, Roseville, CA 95678',
  rating: 3,
  facilities: ['Hot Drinks','Food','Premium wifi'],
  coords: [-121.2764058, 38.7448411],
  hours: [{
    fromDay: 'Monday',
    toDay: 'Friday',
    open: '5:00am',
    close: '8:30pm'
  }, {
    fromDay: 'Saturday',
    toDay: '',
    open: '6:00am',
    close: '8:30pm'
  }, {
    fromDay: 'Sunday',
    toDay: '',
    open: '6:00am',
    close: '8:00pm'
  }]
})
db.locations.update({
  name:'Starbuck\'s'
}, {
  $push: {
    reviews: {
      author: 'Linda',
      _id: ObjectId(),
      rating: 5,
      text: 'Most of the crew has smiles and warm greetings good coffee great music what can I say I likes my coffee.',
      createdOn: new Date('Jul 24, 2017')
    }
  }
})
db.locations.update({
  name:'Starbuck\'s'
}, {
  $push: {
    reviews: {
      author: 'Adam',
      _id: ObjectId(),
      rating: 1,
      text: 'I have not had good service here.',
      createdOn: new Date('Oct 3, 2017')
    }
  }
})
db.locations.update({
  name:'Starbuck\'s'
}, {
  $push: {
    reviews: {
      author: 'Lenecia',
      _id: ObjectId(),
      rating: 3,
      text: 'service fast. brew was cold',
      createdOn: new Date('Sep 10, 2017')
    }
  }
})
