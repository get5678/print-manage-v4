import { FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large">
        返回首页
      </Button>
    </Link>
  </div>
);

const RegisterResult: React.FC<RouteChildrenProps> = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="user-register-result.register-result.msg"
          values={{ email: location.state ? location.state.account : '***' }}
        />
      </div>
    }
    extra={actions}
  />
);

export default RegisterResult;
