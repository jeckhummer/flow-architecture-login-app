import * as React from 'react';
import { Header, Message, Segment } from 'semantic-ui-react';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import { useHistory } from 'react-router-dom';

import { useAsyncData } from '../hooks';
import { IFlowService } from '../services/models';

export const FlowManager: React.FC<{ service: IFlowService }> = ({ service }) => {
    const [header, setHeader] = React.useState<React.ReactNode | null>();
    const [body, setBody] = React.useState<React.ReactNode>();
    const [message, setMessage] = React.useState<{ text: string; color: SemanticCOLORS } | null>(null);
    const [accentColor, setAccentColor] = React.useState<SemanticCOLORS>('blue');
    const [asyncLoading, initAsyncLoading, setAsyncLoading] = useAsyncData<any>();
    const history = useHistory();

    React.useEffect(
        () =>
            service.runFlow(
                ({ body, header, accentColor: headerColor }) => {
                    setMessage(null);
                    setBody(body);
                    setAccentColor(headerColor ?? 'blue');
                    setHeader(header);
                    setAsyncLoading({ status: 'initial' });
                },
                (text, color) => setMessage({ text, color }),
                initAsyncLoading,
                history,
            ),
        [],
    );

    return (
        <Segment color={accentColor} padded loading={asyncLoading.status === 'loading'}>
            {header && (
                <div style={{ marginTop: 20, marginBottom: 30 }}>
                    <Header as="h2" color={accentColor} textAlign="center">
                        {header}
                    </Header>
                </div>
            )}
            {message && (
                <Message color={message.color}>
                    <p style={{ textAlign: 'left' }}>{message.text}</p>
                </Message>
            )}
            {body}
        </Segment>
    );
};
