import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router';

import { routeResolver } from './App';

import Calendar from './Calendar';
import Event from './Event';

import * as ICAL from 'ical.js';

import * as EteSync from './api/EteSync';

class JournalCalendar extends React.Component {
  props: {
    journal: EteSync.Journal,
    entries: Map<string, ICAL.Component>,
    history?: any,
  };

  constructor(props: any) {
    super(props);
    this.eventClicked = this.eventClicked.bind(this);
  }

  eventClicked(event: ICAL.Event) {
    const uid = event.uid;

    this.props.history.push(
      routeResolver.getRoute('journals._id.items._id', { journalUid: this.props.journal.uid, itemUid: uid }));
  }

  render() {
    let items = this.props.entries;

    return (
      <Switch>
        <Route
          path={routeResolver.getRoute('journals._id')}
          exact={true}
          render={() => (
              <Calendar entries={Array.from(items.values())} onItemClick={this.eventClicked} />
            )
          }
        />
        <Route
          path={routeResolver.getRoute('journals._id.items._id')}
          exact={true}
          render={({match}) => {

            return (
              <Event event={new ICAL.Event(items.get(match.params.itemUid))} />
            );
          }}
        />
      </Switch>
    );
  }
}

export default withRouter(JournalCalendar);
