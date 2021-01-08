import './InfoBox.css';
import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core";

export default function InfoBox({title, cases, isRed, active, total, ...props}) {
    return (
        <Card className={`infobox ${active && "infobox--active"} ${isRed && 'infobox--red'}`} onClick={props.onClick}>
            <CardContent>
                <Typography
                    className="infobox__title"
                    color="textSecondary"
                >{title}</Typography>
                <h2 className={`infobox__cases ${!isRed && 'infobox__cases--green'}`}>{cases}</h2>
                <Typography className="infobox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}
