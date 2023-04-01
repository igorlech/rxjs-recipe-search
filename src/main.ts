import { Recipelist } from '@components/recipelist/recipelist';
import './styles.scss';

// bootstrap main App when DOMContentLOADED
document.addEventListener('DOMContentLoaded', () => {
    const recipelist = document.querySelector('.recipelist');
    if (!!recipelist) {
        new Recipelist(recipelist);
    }
});
