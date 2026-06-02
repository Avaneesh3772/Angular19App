export class RestatementConstants {
  public static displayedColumns = ["postId", "id", "name", "email"];
  public static get commentsApiURL(): string { return  'https://jsonplaceholder.typicode.com/comments' }
  public static employeeInfo = [
    {
      name: "Avaneesh",
      age: 35,
      isIndian: true
    },
    {
      name: "Mike",
      age: 22,
      isIndian: false
    },
    {
      name: "Vivek",
      age: 29,
      isIndian: true
    },
    {
      name: "Robert",
      age: 33,
      isIndian: false
    },
    {
      name: "Vijay",
      age: 26,
      isIndian: true
    },
    {
      name: "Maria",
      age: 17,
      isIndian: false
    }
  ];
  
  public static countries = [
    {
      name: "India",
      language: 'Hindi',
      economy: 'Good'
    },
    {
      name: "Japan",
      language: 'Japanese',
      economy: 'Good'
    },
    {
      name: "China",
      language: 'Chinese',
      economy: 'Good'
    },
    {
      name: "England",
      language: 'English',
      economy: 'Best'
    },
    {
      name: "Canada",
      language: 'English',
      economy: 'Best'
    },
    {
      name: "Russia",
      language: 'Russian',
      economy: 'Good'
    }
  ];
}
