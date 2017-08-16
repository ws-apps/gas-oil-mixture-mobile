import { compose, withHandlers } from 'recompose';
import { Share } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setMeasurementUnit,
  setAutoFocusInput,
  setCurrentLocale,
} from '../store/actions';

//components
import Options from './Options';

//helpers
import { getResult } from '../helpers';
import I18n from '../i18n';

const withReduxConnect = connect(
  state => ({
    selectedUnit: state.app.measurementUnit,
    autoFocusInput: state.settings.autoFocusInput,
    appLocales: state.settings.appLocales,
    locale: state.settings.currentLocale,
  }),
  dispatch =>
    bindActionCreators(
      { setMeasurementUnit, setAutoFocusInput, setCurrentLocale },
      dispatch,
    ),
);

const withOptionsHandlers = withHandlers({
  setUnit: ({ setMeasurementUnit, setResult }) => value => {
    setMeasurementUnit(value);
    getResult();
  },
  toggleAutoFocus: ({ setAutoFocusInput, autoFocusInput }) => () => {
    setAutoFocusInput(!autoFocusInput);
  },
  setLocale: ({ setCurrentLocale }) => locale => {
    setCurrentLocale(locale);
  },
  shareApp: ({ locale }) => async () => {
    try {
      const content = {
        message: I18n.t('shareMessage', { locale }),
      };
      const options = {
        dialogTitle: I18n.t('shareTitle', { locale }),
      };
      await Share.share(content, options);
    } catch (e) {
      console.log(e);
    }
  },
});

export default compose(withReduxConnect, withOptionsHandlers)(Options);
