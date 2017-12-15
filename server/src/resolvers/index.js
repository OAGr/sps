import * as _ from "lodash";

const Query = {
   Question: (_, data) => {
       return {id: 334}
   },
   Questions: (_, data) => {
       return [{id: 334}, {id: 33}]
   } 
};

const resolvers = { Query };

export { resolvers };