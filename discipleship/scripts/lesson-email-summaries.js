// Email-only summaries. Keep lesson teaching and saved-answer IDs in data/ unchanged.
(function (root) {
    var summaries = {
        '101-01': [
            'Following Jesus begins a lifelong journey of receiving His Word and growing in faith.',
            'This lesson introduces Growing Together and helps you notice where God has been at work in your story.',
            'You begin reading the Gospel of John and taking your next steps with a spiritual mentor.'
        ],
        '101-02': [
            'Salvation is new life God gives through Jesus, received by faith rather than earned.',
            'The Romans Road explains our need for Jesus and how to respond to His grace.',
            'Baptism makes that new life visible, and God gives His children assurance that they belong to Him.'
        ],
        '101-03': [
            'Prayer is a child talking with a Father who loves to listen.',
            "The Lord's Prayer gives a pattern for relationship, worship, God's priorities, daily needs, forgiveness, and spiritual protection.",
            'You can use that pattern to begin an honest daily conversation with God.'
        ],
        '101-04': [
            'God speaks through the Bible to help us know Him and follow Jesus.',
            'The Three Discovery Questions help us notice what a passage reveals about God, about people, and about our response.',
            'Reading, understanding, and practicing His Word gives us something we can share with another person.'
        ],
        '101-05': [
            'God brings His children into a spiritual family rather than leaving them to follow Jesus alone.',
            'The church shares life like a connected grove and participates like guests bringing food to a potluck.',
            'Belonging means being known, receiving care, and bringing what God has given you to others.'
        ],
        '101-06': [
            'Like the woman at the well, you can invite someone to meet Jesus by telling what He has done for you.',
            'BLESS begins with prayer and grows through listening, eating together, serving, and sharing your story.',
            'Your personal ministry starts with people already around you, and the ABCs help you explain the gospel itself.'
        ],
        '101-07': [
            'When Christians stumble, Jesus calls them back rather than leaving them in condemnation.',
            'Repentance means turning toward God, confessing honestly, and receiving His forgiveness.',
            'Stop, Turn, Tell, and Receive gives you a simple way to return to the Shepherd and keep following Him.'
        ],
        '201-01': [
            'The Father loves us first and welcomes us home through Jesus.',
            'The Greatest Commandment calls us to respond to His love with our heart, soul, mind, and strength.',
            'Loving God grows from receiving His grace rather than trying to earn His acceptance.'
        ],
        '201-02': [
            'Jesus gives believers a new identity that is received by faith rather than built from performance.',
            'His cross and resurrection free us from our old identity and make us new creations in Him.',
            'Putting on Christ means learning to live from the acceptance God has already given us.'
        ],
        '201-03': [
            'Jesus promised the Holy Spirit as the Helper who stays with His people.',
            'GUIDE helps us remember five ways the Spirit works in our lives.',
            'We learn to recognize His leading and keep in step with Him as we follow Jesus.'
        ],
        '201-04': [
            'Spiritual growth begins with a heart that receives the Word and stays rooted in Jesus.',
            'Prayer, the Word, fellowship, stewardship, and fighting sin help us keep drawing life from Him.',
            'These practices do not earn His love, but deepen the roots from which God grows lasting fruit.'
        ],
        '201-05': [
            'The Bible is a library of 66 books that together point us to Jesus.',
            'Understanding the Old and New Testaments and their different shelves helps us find our way through Scripture.',
            'Like the people who rediscovered the book in Josiah\'s day, we are called to receive God\'s Word and live by it.'
        ],
        '201-06': [
            'Jesus showed the travelers to Emmaus that the whole Bible points to Him.',
            'Creation, Fall, Redemption, and Restoration describe the four movements of that one story.',
            'Seeing our own lives within His story gives us hope and helps us explain the gospel to others.'
        ],
        '201-07': [
            'Observe, Interpret, and Apply gives us a simple way to study Scripture faithfully.',
            'We notice what the passage says, understand its meaning in context, and respond to God in our lives.',
            'Practicing with Psalm 23 helps us develop a Bible-study skill we can use and share.'
        ],
        '201-08': [
            "God's mercy, justification, righteousness, and grace are gifts we receive through Jesus.",
            'The forgiven servant shows why receiving mercy should change how we treat other people.',
            'The grace and mercy cycle begins with God\'s love and moves through us as we forgive and show mercy to others.'
        ],
        '201-09': [
            'Jesus is the vine, and His Spirit grows fruit in those who abide in Him.',
            'The nine expressions of the fruit of the Spirit show what becoming more like Jesus looks like.',
            'We depend on Him, fight sin, and trust the Father\'s pruning instead of trying to manufacture fruit on our own.'
        ],
        '201-10': [
            'When we drift from God, the Father invites us to return through repentance and faith.',
            'The Learning Circle helps us reflect honestly, believe the gospel, make a plan, and act with support.',
            'Like the returning son, we come home to a Father who welcomes us through grace.'
        ],
        '202-01': [
            'Jesus calls us to love our neighbors as ourselves because He has first loved us.',
            'The Good Samaritan turns our attention from deciding who qualifies as a neighbor to becoming a neighbor who acts with mercy.',
            'We follow Jesus by moving toward real people and meeting needs across the boundaries we might otherwise keep.'
        ],
        '202-02': [
            'With Jesus as the cornerstone, our closest relationships become places to practice His love.',
            'As spouses, parents, and children, we grow through sacrifice, service, trust, honor, and forgiveness.',
            'His grace helps us take practical steps toward love while recognizing the pain and wisdom needed in broken families.'
        ],
        '202-03': [
            'God\'s mercy makes believers a spiritual family who belong to one another.',
            'The church in Acts 2 shows a shared life of teaching, prayer, meals, generosity, care, and mission.',
            'Connecting to a local church helps us grow, carry burdens, practice the one anothers, and follow Jesus together.'
        ],
        '202-04': [
            'Jesus gives Apostles, Prophets, Evangelists, Shepherds, and Teachers to equip His people for ministry.',
            'Five farmers working one field help us recognize different ways people strengthen the church.',
            'Our gifts are grace rather than labels, and we can discover them by trying a practical way to serve others.'
        ],
        '202-05': [
            'God stays with His people through suffering and uses trials to grow steadfast faith.',
            'Joseph\'s story shows that human evil does not defeat God\'s good purposes.',
            'We can bring Him our pain, seek His help, and trust Him in the valley without pretending hardship is easy.'
        ],
        '202-06': [
            'Worship is responding to God\'s worth with our whole lives.',
            'Paul and Silas singing in prison show that worship does not depend on comfortable circumstances.',
            'As we see God, bow before Him, receive His grace, and go in obedience, worship shapes both gathered church life and ordinary days.'
        ],
        '202-07': [
            'Generosity begins with the grace of Jesus, who gave Himself for us.',
            'The widow\'s offering reminds us that giving reveals trust and that everything we hold belongs to God.',
            'We grow as glad givers by taking a practical next step with what He has entrusted to us.'
        ],
        '202-08': [
            'God\'s covenant love teaches us to love faithfully rather than wait for another person to earn it.',
            'Marriage can display Christ\'s love through sacrifice, forgiveness, and keeping promises.',
            'In every relationship season, we can draw near to God and take the first step toward loving the people closest to us.'
        ],
        '202-09': [
            'Because Jesus bought our forgiveness and made us His own, purity grows from grace rather than earning God\'s love.',
            'RUN reminds us to Remember the Cross, live United with God, and recognize our Need for others when temptation comes.',
            'We guard our hearts through practical boundaries, honest friendships, and repentance when we fall.'
        ],
        '202-10': [
            'Jesus gives His church baptism and the Lord\'s Supper as visible reminders of the gospel.',
            'Baptism declares new life in Christ, while the shared table brings us back to His sacrifice.',
            'We receive these gifts together with faith, honesty, and a readiness to follow Him.'
        ],
        '203-01': [
            'Jesus sends ordinary followers to make disciples and promises to remain with them.',
            'Your personal ministry begins with people in your home, work or school, and neighborhood.',
            'Mapping those relationships helps you notice whom God is inviting you to love and disciple.'
        ],
        '203-02': [
            'BLESS begins with talking to God about people before talking to people about God.',
            'Praying for their life, their heart, and your part helps you care for people by name.',
            'A prayer card and a regular rhythm turn that care into a practical daily habit.'
        ],
        '203-03': [
            'Listening and sharing meals help people feel known and welcomed.',
            'Jesus\' hospitality shows us how to make room for others without needing to impress them.',
            'We can ask good questions, remember what people share, and invite someone to our table.'
        ],
        '203-04': [
            'Jesus shows that true greatness is found in serving rather than being served.',
            'Because He has already loved and served us, we can give without trying to earn approval.',
            'Our time, talents, and treasure become practical ways to care with action for someone else\'s good.'
        ],
        '203-05': [
            'Sharing faith connects another person\'s story, our own story, and the story of Jesus.',
            'A short testimony and the 3 Circles help us explain the gospel plainly in an ordinary conversation.',
            'Our part is to share faithfully and trust God with the response.'
        ],
        '203-06': [
            'Our work and school lives matter to God and give us everyday places to follow Jesus.',
            'Daniel shows how faithful work, integrity, and prayer can bear witness in a difficult setting.',
            'We bring BLESS into our second space by noticing people, praying for them, and serving well.'
        ],
        '203-07': [
            'Following Jesus includes spiritual resistance, but God equips His people to stand firm.',
            'His armor helps us meet the enemy\'s lies with truth, faith, Scripture, and prayer.',
            'We stand together in Christ\'s strength rather than trying to face the battle alone.'
        ],
        '203-08': [
            'Jesus calls ordinary people to help others follow Him and pass on what they have received.',
            'Discipleship grows through shared life as we learn, talk, practice, encourage, and send.',
            'We can begin with one person or a small group and trust God to multiply what He grows.'
        ],
        '203-09': [
            'God brings people and churches together to share in His mission.',
            'Priscilla and Aquila show how ordinary work, hospitality, and partnership can serve the gospel.',
            'We can pray, give, serve, and go with partners in our city and among the nations.'
        ],
        '203-10': [
            'Jesus calls us to Himself and shapes us to serve His people.',
            'SHAPE helps us consider our spiritual gifts, heart, abilities, personality, and experiences.',
            'Calling grows clearer as we serve real needs and invite others to help us recognize God\'s work in us.'
        ]
    };
    if (typeof module === 'object' && module.exports) module.exports = summaries;
    else root.GrowingTogetherLessonEmailSummaries = summaries;
})(typeof window !== 'undefined' ? window : globalThis);
