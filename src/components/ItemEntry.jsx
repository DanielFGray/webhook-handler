// @flow
import React, { Component } from 'react'
import styles from './list.sss'

class ItemEntry extends Component {
  props: {
    addItem: Function,
  }

  state = {
    num: 4,
  }

  numChange = (e: SyntheticInputEvent) => {
    this.setState({ num: Number(e.target.value) })
  }

  submit = (e: SyntheticInputEvent) => {
    e.preventDefault()
    this.props.addItem(this.state.num)
    this.setState(p => ({ num: p.num + 1 }))
  }

  render() {
    return (
      <div className={styles.formGroup}>
        <form onSubmit={this.submit}>
          <label htmlFor="list_num">Enter a number: </label>
          <input
            name="list_num"
            type="number"
            value={this.state.num}
            onChange={this.numChange}
          />
        </form>
      </div>
    )
  }
}

export default ItemEntry
