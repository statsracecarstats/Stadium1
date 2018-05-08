#This script was built to scrap specific wiki page about sports stadium
# Rev1 - April 09 2018 - Paul Cunningham
# Rev2 - May 05 2018 - Paul Cunningham
#This scrip pulls the wiki table of US stadiums by attendance and grabs the link.
#adds in NBA stadium list
library(rvest)
rm(list=ls())
#wiki page with list of US stadiums
url = "https://en.wikipedia.org/wiki/List_of_U.S._stadiums_by_capacity#cite_note-1"
#load page to list object
stadiumPage = read_html(url)
#load table contents to list and convert to data.frame
stadiumTable = data.frame(html_table(stadiumPage, header = TRUE, trim = TRUE, fill = TRUE)[[2]])
#remove the reference numbers
stadiumTable$Stadium = gsub('[0-9]',"",stadiumTable$Stadium)
stadiumTable$Stadium = gsub('\\[',"",stadiumTable$Stadium)
stadiumTable$Stadium = gsub('\\]',"",stadiumTable$Stadium)

links = stadiumPage %>% html_nodes("a") %>% html_attr('href')
title = stadiumPage %>% html_nodes("a") %>% html_attr('title')

#get index for which titles have "(..)"
X = gregexpr('\\(', title)
X2 = which(X!=-1)

for (i in 1:NROW(X2)){
  title[X2[i]] = substr(title[X2[i]],1,X[[X2[i]]]-2)
}

#add wiki links to main table
stadiumTable$Link = paste("https://en.wikipedia.org", links[match(stadiumTable$Stadium, title)], sep = "")
stadiumTable = stadiumTable[-which(colnames(stadiumTable)=="Rank")]

#<><><><><><><><
#ADD IN NBA LIST, only Cleaveland on oringal list
url = "https://en.wikipedia.org/wiki/List_of_National_Basketball_Association_arenas"
NBAPage = read_html(url)
NBATable = data.frame(html_table(NBAPage,header =TRUE,trim=TRUE,fill=TRUE)[[1]])
NBATable[,c("Image","Ref.s."):=NULL]
#remove uselesscolumns
NBATable = NBATable[c("Arena","Location", "Team.s.","Capacity","Opened")]
#rename columns
colnames(NBATable) = c("Stadium","City", "Tenant","Capacity", "Year.opened")
NBATable$Type = "Basketball"
NBATable$State ="Unknown"
#seperate city and state into columns
X = gregexpr(',', NBATable$City)
for (i in 1:NROW(X)){
  NBATable$State[i] = substr(NBATable$City[i], X[[i]][1]+2,nchar(NBATable$City[i]))
  NBATable$City[i] = substr(NBATable$City[i],1,X[[i]][1]-1)
}
#get NBA stadium wiki links
links = NBAPage %>% html_nodes("a") %>% html_attr('href')
title = NBAPage %>% html_nodes("a") %>% html_attr('title')

#Merge NBA table with full table
stadiumTable = rbind(stadiumTable,NBATable)

