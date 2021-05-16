const path = require('path');
const PORT = process.env.PORT || 5000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('60a081fce7c26b1272bdf0c1')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		'mongodb+srv://proxyUser:JMSMBDcMzjxdox77@retro-games.ufnze.mongodb.net/retro-games?retryWrites=true&w=majority'
	)
	.then((result) => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'NewUser',
					email: 'newuser@test.com',
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
		app.listen(PORT, () => console.log(`Listening on ${PORT}`));
	})
	.catch((err) => {
		console.log(err);
	});
/* 
app.listen(PORT, () => console.log(`Listening on ${PORT}`)); */
