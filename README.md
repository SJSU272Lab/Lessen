# Fall16-Team19





Fall 2016
CMPE 272
    

Project Report




TEAM 19
NEHA KUMAR (010832523)
SANDEEP KUMAR CHAWAN (011496641)
SRINIVASA RAO VELAGA (010810397)
SHILPA CHANDRA (011418264)



Instructor:
Rakesh Ranjan


Project Name: 	Lessen



			       Website hosted on AWS:   






Introduction( Introduction Video)

“According to a recent survey, the number of prospective donors decreases just because
they have to go to a donation camp or NGO to donate the items. Since, everyone wants
to save the trouble of visiting NGO, the items end up getting  dumped outside
the house which could have been used by a needy, had there been a platform.”

This project implementation focuses on selling the donated items with less operational cost. This can be attained by proving same platform to donors and buyers where donors will upload images of items they wish to donate using mobile app or website portal. Once these items are approved by the admin, these donated items are visible to other users/buyers for buying at a minimal cost.  






Problem Statement:

Savers/goodwill/salvation army buys the donated items from local NGO’s which requires storage cost, maintenance cost and logistics cost. This results in increased operational cost since they have to keep all these items in their store till they are sold. Also, since there is no proper way of arranging items, it takes a lot of time for the store as well as the buyer to look for items they are interested in. Since, there is no inventory maintained by the thrift stores, it is difficult to track the items.

Solution:

Through this implementation our goal is to minimize operational cost by providing a platform where donor can upload item and buyer can look for items he is interested in. If both donation and purchase doesn’t happen within some time frame, admin notifies the logistics team to pick up the donated item from donor’s place.

Implementation:

The solution was implemented using Mean Stack for website and Android sdk for mobile
app. The application is hosted on AWS on
Ec2-54-187-80-226.us-west-2.compute.amazonaws.com

	
  			Architecture diag for mean stack code flow

Procedures:

Our approach to minimize operational cost involves implementing a portal as a platform for donors and buyers to upload items to be donated by donors and their prospective buyer to look into same platform. Admin keeps track of the donations made by area, if there are multiple donations from a area, admin creates donation event so that both donor and buyer can come to donation drive and items will be sold on the same day hence by reducing operation cost. These events will be posted on social media and also on website portal where every user can look for upcoming events.   




Usecases:

Usecase-1: Donate items online

Actor
Role
AnyActor
donor, buyer
AnyParty
consumer

Usecase description: The donor who needs to donate the goods uploads the items and its description on the website.  Once the item is uploaded, it goes to admin for approval. Now, admin can approve the item if it is usable and same is published on website. Admin can also decide if the item goes on website as normal sellable item or biddable item.

Usecase-2: Buy items online

Actor
Role
AnyActor
consumer, donor
AnyParty
consumer

Usecase description: Any consumer who ever likes the goods posted online buys items from the website. Where the employee belongs to the charity organisation. Buyer can bid for the biddable item, highest bidder wins the item.


Usecase-3: Create event

Actor
Role
AnyActor
admin
AnyParty
manager, organisation, admin

Usecase description: Organisation/Website admin creates event based on the data of maximum donations available from a particular city/county. Events are published on social media and also on website.


Usecase-4: Analytics


Actor
Role
AnyActor
Admin, 
AnyParty
manager, organisation, admin

Usecase description: Admin/Organization can create event for donation drive by analyzing/tracking the donations made by donors based on area. Admin can also analyze the max donations made in which month and from which area.




Mobile Application
We have developed Mobile Application using android studio. Our Mobile Application includes the following features
Users Authenticated while login to verify their credentials.
User will have home page where he/she can see active bids.
User can also view won bids and lost bids.
User can add items to be donated by uploading images of items.
User will provide details like item description, category, condition, price at which he/she bought, location about item to be donated .
As soon as the user adds the item it will be posted successfully for admin approval.
User can see the added item once the admin approves it.
User can also place bid for the available items in homepage.
Whenever User wins or loses a bid he will get notified in either won list or lost list.  

Mobile Application User Interface:
User Home Page:
Android layout for home page will contain our app login and three separations 
Active Bids
Won
Lost
In active bids user can see all the items which are in bidding state. Won will have the items the user won in bidding and lost will have items for user bidded but lost. User can add item to be donated by going for “+” which directs user to adding item layout.  



Adding Item
Adding item includes user taking picture and providing item details. 
 

Picture Uploading
Users are allowed to use camera through app for uploading picture. Once the item is uploaded then we are storing image url in  common database for website and mobile application. 


Item Posted for admin approval :
 
Once user uploads the items image and details it will be posted for admins approval.



Place Bid
Place Bid allows user for bid items. User bid amount should greater than the minimum bid amount for that particular item. 



LESSEN ADMIN:
 
Approve uploaded products:
·  	The admin is going to approve/reject/edit uploaded items for donation.
·  	This is the admin webpage. Here he can check the products pending approval.
 
 

He can view the product related information uploaded by the donor.


 
 
If the admin is unhappy with the product price, he can change it.

 
 
Once the product is uploaded on the website, the admin can change the product information at any point of time, if he sees that there is not a lot of demand for this product. He can change the type of sale from auction sale to direct sale and/or reduce the price of the product.
 
 
Logistics Management
·  	





Once there are enough products waiting to be picked up from a particular area, the admin can notify our logistics partner.
 
·  	When the admin hits the “notify logistics” button, the logistics partner gets an email with all the information related to donor’s address, donor’s contact etc and can arrange for pickups.
 
·  	Once the pickup notification is sent, the admin can monitor the status. And once the pickup is complete, he can update his database.
 
User Management:
·  	Admin has a dashboard where he can view all the current users registered on the website.

Events Management:
·  	Admin can organize donation drives.

·  	All the upcoming donation drive information is posted on Twitter and on the user website.
 
 
 
LOG ANALYTICS:
·  	ELK stack has been used for performing dynamic log analysis.
o   Logstash is a dynamic data collection pipeline with an extensible plugin ecosystem and strong Elasticsearch synergy.
o   Elasticsearch is a distributed, JSON-based search and analytics engine designed for horizontal scalability, maximum reliability, and easy management
o   Kibana gives shape to your data and is the extensible user interface for configuring and managing all aspects of the Elastic Stack.
 
Total hits on website, total number active, total number of distinct products viewed analytics

 
Hits per day and product-type favored analytics
 
 
Top product hits analytics

 
 
URL hits analytics
o   Helps admin focus on which webpages are users most interested in, where are they spending their time, where are they not spending their time.

 


















Bid tracking analytics
 




















LESSEN USER:

Registered user/Guest user can browse the website hosted on AWS on http://ec2-54-187-80-226.us-west-2.compute.amazonaws.com 

Landing page for the website looks like this


User can search for products and view product details listed on website

Any user can view the upcoming donation events


Any user can donate any item just by clicking a picture of item to be donated and uploading it and filling minimum details about the product

  



Results:

By creating a website portal and mobile app, we will be able to bring the donor and buyer closer. Also, by analyzing and tracking the donations made depending on city, admin can create donation events. This will result in reduced operational cost as items donated will get sold the same day excluding the need to gather items from donors, storage and maintenance costs .

Conclusions:

So the idea is to implement a platform which brings donors and buyers together and to generate  revenue from items donated with lowest operating costs.



