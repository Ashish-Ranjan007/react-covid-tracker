import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './Infobox.css';

const Infobox = ({ title, cases, total, ...props }) => {
	return (
		<Card onClick={props.onClick} className="Infobox">
			<CardContent>
				<Typography className="Infobox__title" color="textSecondary">
					{title}
				</Typography>
				<h2 className="Infobox__cases">{cases}</h2>
				<Typography className="Infobox__total" color="textSecondary">
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
};

export default Infobox;
