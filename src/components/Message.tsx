import * as React from 'react';
import { Icon, Button, SemanticICONS } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

interface IProps {
    onClick: () => void;
    buttonLabel: string;
    icon: {
        color?: SemanticCOLORS;
        name: SemanticICONS;
    };
}

export const Message: React.FC<IProps> = ({ onClick, buttonLabel, icon }) => {
    return (
        <>
            <Icon size="huge" name={icon.name} color={icon.color ?? 'green'} />
            <br />
            <br />
            <Button fluid onClick={onClick} size="large" primary icon>
                {buttonLabel}
            </Button>
        </>
    );
};
