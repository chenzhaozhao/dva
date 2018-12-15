import intl from 'react-intl-universal'
import find from 'lodash.find'
import React, {PureComponent} from 'react'
import styles from './index.less'
import images from '../../common/images'
import Icon from '../../components/Icon'
import {SUPPOER_LOCALES} from '../../common/global'
import cnFlag from '../../assets/images/cnFlag.png'
import amFlag from '../../assets/images/americaFlag.png'
import earth_map_hover from '../../assets/images/map_hover.png'
import {Dropdown} from 'element-react'
const imgFlag={"简体中文":cnFlag,"English":amFlag};
const currentLocale = find(SUPPOER_LOCALES, {
    value: sessionStorage.getItem('qq-to-locale-lang')
  }
)
export default class selectLanguage extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      modelStatus: false,
      currentLocale: (currentLocale && currentLocale.name) || 'en-US'
    }
    this.handleClick = this.handleClick.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  handleClick(e) {
    this.setState({modelStatus: false})
  }

  componentDidMount() {
    console.log(currentLocale);
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount() {

    document.removeEventListener('click', this.handleClick, false)
  }

  onSelectLocale(value) {
    window.location.search = `lang=${value}`
  }

  modelStatus(e) {
    this.setState({
      modelStatus: !this.state.modelStatus
    })

    e.nativeEvent.stopImmediatePropagation();
  }

  switchLocale(index) {
    const locale = SUPPOER_LOCALES[index];
    this.setState({
      modelStatus: false,
    })
    // if (locale.name !== this.state.currentLocale) {
      this.setState({
        currentLocale: locale.name
      });
      this.onSelectLocale(locale.value)
    // }
  }

  renderItem() {
    return (SUPPOER_LOCALES.map((locale, index) => {
      return <Dropdown.Item command={String(index)} key={String(locale.name)}>
        <div style={{width: 100}}><img src={imgFlag[locale.name]} alt=""/><span className={styles.cnFont}>{locale.name}</span></div>
      </Dropdown.Item>
    }))
  }
  render() {
    return (
      <div className={styles.selectLanguage}>
        <div className={styles.cnWarp}>
          <Dropdown menuAlign='start' style={{height: 40, marginTop: 2}} onCommand={this.switchLocale.bind(this)}
                    menu={(
                      <Dropdown.Menu>
                        {/*<Dropdown.Item><div style={{width:100}}><img src={cnFlag} alt=""/><span onClick={()=>this.switchLocale.bind(this, SUPPOER_LOCALES[1])} className={styles.cnFont}>简体中文</span></div></Dropdown.Item>*/}
                        {this.renderItem()}
                      </Dropdown.Menu>
                    )}>
            <div>
                  <span className={styles.snsTitle}>
                     <img src={currentLocale?imgFlag[currentLocale.name]:cnFlag} alt=""/><i style={{transform: 'scale(0.7) translateY(1px)'}}
                                                  className="el-icon-caret-bottom el-icon--right"></i>
                     </span>
            </div>
          </Dropdown>
        </div>

        {/*<p className={styles.toggleLanguage} onClick={(e)=>this.modelStatus(e)}>*/}
        {/*/!*<span className={styles.mapIcon}></span>*!/*/}
        {/*/!*<span className={styles.selectedLanguage}>{this.state.currentLocale}</span>*!/*/}

        {/*<i className="el-icon-caret-bottom el-icon--right"></i>*/}

        {/*</p>*/}
        {/*<ul className={this.state.modelStatus ? styles.show : styles.modelPanel}>*/}
        {/*{*/}
        {/*SUPPOER_LOCALES.map((locale, index) => (*/}
        {/*<li key={index} onClick={this.switchLocale.bind(this, locale)}>{locale.name}</li>*/}
        {/*))*/}
        {/*}*/}
        {/*</ul>*/}
      </div>
    )
  }
}
