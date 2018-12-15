import React, { PureComponent } from 'react'
import styles from './statement.less'
import find from "lodash.find";
import {SUPPOER_LOCALES} from "../../common/global";
import PrivacyEnglish from "./PrivacyEnglish";
const currentLocale = find(SUPPOER_LOCALES, {
        value: sessionStorage.getItem('qq-to-locale-lang')
    }
);
export default class Statement extends PureComponent {
  render() {

    return (
      <div className={styles.statement}>
          {currentLocale.value==="en-US"?
              <div className={styles.content}>
                  <h2>Legal Statement</h2>
                  <h3>Article One</h3>
                  <p>This website is to provide a professional international level trading platform and financial products to the global digital asset enthusiasts and investors as much as possible under the premise of not violating the relevant laws and regulations of the Republic of Seychelles. It is forbidden to use this website for all illegal trading activities such as money laundering, smuggling, commercial bribery, etc. If such incidents are found, the website will freeze the account and immediately report it to the authorities.</p>
                  <h3>Article Two</h3>
                  <p>When the competent authority issues the corresponding investigation documents and asks the website to cooperate with investigation of the designated users, or when the user accounts are sealed, frozen or transferred under such premises; the website will provide corresponding user data according to the requirements of the authority. , or take the appropriate action as required. Therefore, the site does not assume any responsibility for the leakage of user privacy, the inability of  the account to operate, and the resulting losses on the user side.</p>
                  <h3>Article Three</h3>
                  <p>If the user of this website violates the relevant laws of the Republic of Seychelles in violation of the provisions of this statement, the site as a provider of the service is obliged to improve the rules and services of the platform; but this site does not have the motive and actual fact of violating the Republic of Seychelles in that case.  and thus do not bear any joint responsibility for the user’s conduct.</p>
                  <h3>Article  Four</h3>
                  <p>Anyone who logs into this website in any way or uses the services of the website directly or indirectly is deemed to be willing to accept the restrictions of this website.</p>
                  <h3>Article  Five</h3>
                  <p>The issues not covered in this statement are referred to the laws of Singapore. We will comply with the laws of Singapore,when the statement conflicts with the   laws of it.</p>
              </div>
              :<div className={styles.content}>
          <h2>法律声明</h2>
          <h3>第一条</h3>
          <p>本网站的宗旨是在不违反新加坡相关法律法规的前提下，尽可能地为全球广大数字资产爱好者及投资者提供专业的国际化水准的交易平台和金融产品。禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将冻结账户，立即报送有权机关。</p>
          <h3>第二条</h3>
          <p>当有权机关出示相应的调查文件要求本站配合对指定用户进行调查时， 或对用户账户采取查封、冻结或者划转等措施时，本站将按照有权机关的要求协助提供相应的用户数据，或进行相应的操作。 因此而造成的用户隐私泄露、账户不能操作及因此给所造成的损失等，本站不承担任何责任。</p>
          <h3>第三条</h3>
          <p>本网站使用者因为违反本声明的规定而触犯新加坡相关法律的，本站作为服务的提供方，有义务对平台的规则及服务进行完善， 但本站并无触犯新加坡相关法律的动机和事实，对使用者的行为不承担任何连带责任。</p>
          <h3>第四条</h3>
          <p>凡以任何方式登录本网站或直接、间接使用本网站服务者，视为自愿接受本网站声明的约束。</p>
          <h3>第五条</h3>
          <p>本声明未涉及的问题参见新加坡有关法律法规，当本声明与新加坡相关法律法规冲突时，以新加坡相关法律法规为准。</p>
              </div>}
        </div>
    )
  }
}