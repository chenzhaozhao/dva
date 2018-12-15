
import styles from './index.scss';
export default ()=>{
    return(
        <div className={styles.warp}>
          <div className={styles.warp_position}>
               <p className={styles.warn}>网站升级维护中...</p>
              <p className={styles.notice}>cｅrbe定于 2018年12月09日 8:00（GMT+8，以下同）停机维护，期间将暂停服务，给您造成的不便，敬请谅解。</p>
              <div><button className={styles.btn}>查看公告</button></div>
          </div>
        </div>
    )
}