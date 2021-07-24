import spinner from 'url:../images/spinner.svg';

import drop from 'url:../images/weather-icons/drop.png';
import wind from 'url:../images/weather-icons/wind.png';
import humidity from 'url:../images/weather-icons/humidity.png';

import sunD from 'url:../images/weather-icons/sunD.png';
import cloudyD from 'url:../images/weather-icons/cloudyD.png';
import cloudDN from 'url:../images/weather-icons/cloudDN.png';
import cloudsDN from 'url:../images/weather-icons/cloudsDN.png';
import rainyD from 'url:../images/weather-icons/rainyD.png';
import rainDN from 'url:../images/weather-icons/rainDN.png';
import stormDN from 'url:../images/weather-icons/stormDN.png';
import snowyDN from 'url:../images/weather-icons/snowyDN.png';
import mistDN from 'url:../images/weather-icons/mistDN.png';
import skyN from 'url:../images/weather-icons/skyN.png';
import cloudyN from 'url:../images/weather-icons/cloudyN.png';
import rainyN from 'url:../images/weather-icons/rainyN.png';

export default icons = {
  spinner,
  drop,
  wind,
  humidity,
  weatherIcon: 
    {
      '01d': sunD,
      '02d': cloudyD,
      '03d': cloudDN,
      '04d': cloudsDN,
      '09d': rainDN,
      '10d': rainyD,
      '11d': stormDN,
      '13d': snowyDN,
      '50d': mistDN,
      '01n': skyN,
      '02n': cloudyN,
      '03n': cloudDN,
      '04n': cloudsDN,
      '09n': rainDN,
      '10n': rainyN,
      '11n': stormDN,
      '13n': snowyDN,
      '50n': mistDN,
    },
};
