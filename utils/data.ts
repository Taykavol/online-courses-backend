const course  = [{
    id:1,
    name:"Road to 2600",
    description:"This is decription, for you and your life.",
    category:"Opening",
    level:"1600+",
    author:{name:"Vadim Moiseenko",title:"GM"},
    students:[{id:"235"}],
    price:16.4,
    priceSale:9.99,
    whyChooseCourse:["This is great course"],
    picture:"",
    status:"BUILD",
    curriculum:[
    {
      id:1,
      name: "Introduction 2",
      lessons: [
        {id:1, name: "Pawn and goo", description: "Hey", video:{id:1,duration:0,vimeoId:null},puzzles:[
          {id:1, fen:"rnbqkbnr/ppppppp1/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq", solution:["e4","e5","Nf3"]},
          {id:2, fen:"rnbqkbnr/ppppppp1/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq", solution:["e4","e5","Nc3"]},
          {id:3, fen:"rnbqkbnr/ppppppp1/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq", solution:["e4","e5","d3"]},
          ] },
        {id:2, name: "Knight", description: "Hey", video:{id:2,duration:5,vimeoId:null},puzzles:[] },
        {id:3, name: "Bishop", description: "Hey", video:{id:3,duration:0,vimeoId:null},puzzles:[] },
        {id:4, name: "Rook", description: "Hey", video:{id:4,duration:0,vimeoId:null},puzzles:[] },
        {id:5, name: "Queen", description: "Hey", video:{id:5,duration:0,vimeoId:null},puzzles:[] }
      ]
    },
    {
      id:2,
      name: "Opening",
      lessons: [
        {id:6, name: "Petrov Defence", description: "Hey", video:{id:6,duration:0,vimeoId:null},puzzles:[] },
        {id:7, name: "Sicilian Defence", description: "Hey", video:{id:7,duration:0,vimeoId:null},puzzles:[] },
        {id:8, name: "Queen Gambit", description: "Hey", video:{id:8,duration:0,vimeoId:null},puzzles:[] },
        {id:9, name: "Benoni System", description: "Hey", video:{id:9,duration:0,vimeoId:null},puzzles:[] }
      ]
    }
  ],
    averageRating: 3,
    comments:[],
    totalPurchase: 5,
    forSearchEngine: 142,
    createdAt:Date(),
    totalRevenue:54.43
  }]

  export default course