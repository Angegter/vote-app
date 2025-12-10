poll1 = Poll.create!(title: "Your favorite programming language?") 
poll1.votes.create!(option: "Ruby")
poll1.votes.create!(option: "JavaScript")
poll1.votes.create!(option: "Python")

poll2 = Poll.create!(title: "Best frontend framework?")
poll2.votes.create!(option: "React")
poll2.votes.create!(option: "Vue")
poll2.votes.create!(option: "Angular")

poll3 = Poll.create!(title: "Which day is best for deployment?")
poll3.votes.create!(option: "Monday")
poll3.votes.create!(option: "Friday")
poll3.votes.create!(option: "Saturday")

puts "Created #{Poll.count} polls with initial votes."
