import transitions from '@material-ui/core/styles/transitions'
import { TextField, Typography, Checkbox, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { CustomizedSnackbar } from '../../../Snackbar/Snackbar'
// import { useSpeechContext } from '@speechly/react-client'
import { v4 as uuidv4 } from "uuid"
import React, { useState, useContext } from 'react'
import { ExpenseTrackerContext } from '../../../../context/context'
import formatDate from '../../../../utils/formatDate'

import useStyles from "./styles"
import { expenseCategories, incomeCategories } from '../../../../constants/categories'

const initialState = {
  amount: '',
  category: '',
  type: "Income",
  date: formatDate(new Date()), // start date
  finalDate: formatDate(new Date()),
  period: 1,
  periodType: "Month", // month/day/year
}

const FormPeriodical = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState(initialState)
  const [finalDate, setFinalDate] = useState(false)
  const { addTransaction } = useContext(ExpenseTrackerContext)
  // const {segment} = useSpeechContext() TODO add voice controlled periodical payments
  const [open, setOpen] = useState(false)

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || Number(formData.amount) <= 0 || Number(formData.period) <= 0 || formData.category === '' || formData.periodType === '' || !formData.date.includes('-')) return

    var transaction = {
      ...formData,
      amount: Number(formData.amount),
      period: Number(formData.period),
      id: uuidv4()
    }

    transaction.finalDate = finalDate ? transaction.finalDate : null

    setOpen(true)
    // add periodical
    addTransaction(transaction)

    // transaction.period = null;
    // transaction.periodType = null;
    // transaction.finalDate = null;
    // transaction.periodical = true;
    // addTransaction(transaction)

    setFormData(initialState)

    // add first payment
    transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4()
    }
    setOpen(true)
    transaction.period = null;    
    addTransaction(transaction)
    setFormData(initialState)
  }

  const selectedCategories = formData.type === "Income" ? incomeCategories : expenseCategories

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        {/* <Typography align="center" variant='subtitle2' gutterBottom>
        {segment && segment.words.map((word) => word.value).join(' ')}
      </Typography> */}
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {selectedCategories.map((c) =>
              <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField type="number" label="Amount" fullWidth value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="start date" type="date" value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="final date*" type="date" value={formData.finalDate} disabled={!finalDate}
          onChange={(e) => setFormData({ ...formData, finalDate: formatDate(e.target.value) })} />
      </Grid>
      <Grid item xs={2}>
        <Checkbox label="set final date" color="default"
          onChange={(e) => setFinalDate(e.target.checked)} />
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label="payment period:" fullWidth value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select fullWidth
            value={formData.periodType}
            onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
          >
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
            <MenuItem value="Year">Year</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default FormPeriodical