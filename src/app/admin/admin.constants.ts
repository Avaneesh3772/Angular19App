export class AdminConstants {
  public static topics = ["Eduction", "Health", "Sports"]
  public static timeOptions = ["Morning", "Afternoon", "Evening", "Night"]
  public static accOrPort = ["Account", "Portfolio",]
  public static proficiencyOptions = ["Beginner", "Intermediate", "Good", "Expert"]
  public static displayedColumns = ["monthYear", "initiationdate", "template", "initiatedby", "status"];
  public static get userApiURL(): string {return 'https://jsonplaceholder.typicode.com/users'}
  public static get adminMockDataURL(): string {return '/assets/mockData/adminMockData.json'}
}

