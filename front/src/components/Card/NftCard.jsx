import { Grid, Paper } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    imageElement: {
        width: "100%"
    }
  });

export default function NftCard({data}) {

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12} align="center">

            <Paper elevation={5}>
                <Grid container>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                        <img src={data.img} className={classes.imageElement}/>
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} align="center">
                        {"Id : " + data.indexId}
                    </Grid>

                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} align="center">
                        {"Class : " + data.class}
                    </Grid>

                </Grid>
            </Paper>
            </Grid>
        </Grid>
    )
}
