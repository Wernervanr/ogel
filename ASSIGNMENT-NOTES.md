## Assignment A

##### Produce a page to report the machine statuses of the last 24 hours in the database (e.g. January 7th).

First nessesity was creating a view to display the data. Though I know PHP, I felt cleaner code could be created approaching the assignment
using API calls. Of all the data, the consistant factor in each table row were the three machine names. These could be distinquished and I could
base my queries in the Model on the machine name.

Second was determining the last 24 hours in the database. I did this by grabbing the last item added to the database, and subtracting 24 hours.
Subtracting the 24 hours in the model meant that I could keep code smaller and clean on multiple functions within the Controller. The last item 
added to the database minus 24 hours gave me a start date for the queries in a dynamic way that could work for possibly new machines added at a 
later time too. 


###### The total net production for the machine and the percentage of scrap vs gross production.
Though it could be solved using just PHP, I am most comfortable using JavaScript. If I could first get all the data from each machine from the
last 24 hours, I could manipulate this and subtract the data I needed using JavaScript. In the listing.js, an API call retrieves each unique 
machine name. Based on that, generic data as well as runtime and produce per hour could be retrieved using new API calls for each machine name. 
Using methods such as .filter() and .reduce() I could seperate the data based on variable name. I then had access to the values and could 
calculate the total of each variable name, and with the right formula get the net production as well as the percentage of scrap. 


###### The percentage of downtime for a machine.
Wether the machine had downtime and when this was restored, was stored in a different table. This is where I thought and table join in SQL 
could possibly be of use. This I do not have the most experience with, and to give an honest impression of my skillset I wanted to show how I 
would alternatively approach this. The machine name was again the consistant factor, so I could again base my query on the machine name and get 
all the data from the last 24 hours. I then had to distinquish between which tablerow was for downtime, and which one was to state that the 
machine was restored back to running. A machine couldn't be broken twice in a row without being fixed in the meantime, so I based the 
distinquishment on the datetime. The cleanest approach with the least amount of code was to keep this distinquishment close to the database,
so I went for a backend solution in the controller. I ran into the issue of a machine that stopped running 5 minutes before the day ended, and 
solved this by setting a static date for when this is the case. Done with the distinquishment, the method in the controller returns a total of 
the downtime in the last 24 hours from the requested machine name.

###### A graph/table showing the net production (gross production – scrap) for every hour.
This was tricky, as the data is saved per 5 minutes. I had to dynamically create the query. Given there are 24 hours in a day, 24 times per machine 
the data of the last hour had to be retrieved. I created an empty variable in the controller. With an SQL query for every hour using a For loop, each 
production value was added to that variable, while each scrap value was subtracted from that variable. That variable is then added to the array of 
production per hour. The datetime_from value for the query is then manipulated to be one hour later. I could then use the for loop again to determine 
the new datetime_to value and redo the queries for the hour after. At the end of the for loop, an array with the total production for every hour.

To display the net production for every hour in a neat little graph, I used the suggested HighCharts library.

## Assignment B

For this assignment I could use the same generic machine data used to get the net production and the scrap percentage. I created one JS function to 
determine wether the status was good, warning or fatal. To check if warning, I thought looping over the values of core temperature was the best approach.
Because the temperature had to be higher than 85 for longer than 15 minutes, I had to check if the value the temperature was higher than 85 for the last 
4 tablerows in the database. The check for fatal was easier, as the temperature for that only had to be over 100 once. The return of this function is a 
string, that I could directly use as a class name to the machine name display. In CSS I then created the colors associated with that class name.

As a sidenote, I was slightly confused by the conditions that had to be met in order to be a warning or fatal. See below.


- Use warning/orange if the temperature has been over 85, but under or equal to 100 degrees for more than 15 minutes.
- Use fatal/red when [higher than 100 degrees] or [higher than 85 degrees for longer than 15 minutes].

These seem to contradict each other. For a moment I thought 'more' in the condition to be a warning did not mean the same as 'longer' in the condition to 
be a fatal. 'More' could be the total time, while 'longer' could be successive time. This however meant that all three machines would always be in a 
warning status as each machine's total time of being higher than 85 degrees was over 5 hours. If I remember correctly. 
This did not feel correct, so I went with 'fatal' if 100 > degrees, and warning for 85 > && <= 100. 

## Assignment C

I created the functions to get the individual percentages, but ran into a scoping issue to determine the total OEE percentage with those statistics. I 
played around for the solution for a little while, but ran out of time as I promised not to take too long for the assignment. My last frame of thought was 
that perhaps session storage could help out here. If that wouldn't work as desired, I would've explored stackoverflow for similar issues and try out/adjust 
solutions until one worked. I am not one to give up, but as assignment C was optional and time closed in I decided to let this be for the time being and 
continue on looking for the solution after turning in the assignment to Marviq.

## Side Notes

- I purposely stayed away from large extensive frameworks so I could be able to show Marviq the foundation of my skillset. I believe, and so far this turned 
out to be true for me, that with a strong foundation someone can quickly learn new frameworks. So far I have learned the basics of Laravel, React, Slim and after 
this assignment I wanted to pick up AngularJS.

- The assignment said that code comments are valued, yet my code doesn't have too much of it. I've been reading Uncle Bob's books, and find myself strongly 
agreeing with his statement that when code needs many comments, variable names could possibly be more descriptive. I find clean, readable and minimal yet 
functional code incredibly important and take great pride in keeping mine exactly like that.

- I have a background in graphic design, and could have done a better job in the design of the dashboard, but as time was limited and the assignment more about 
the code rather than how the application looks, I didn't invest much time in an epic design.

- The dashboard shows the statistics rounded up with two decimals. This can be changed in the calculator functions in the handlers.js. My numbers were the same 
as those in the example data.