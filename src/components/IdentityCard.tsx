import { Avatar, Card, CardContent, Typography } from "@mui/material"
import { Identity } from "../utils"
import { useEffect, useState } from "react"
import { discoverByIdentityKey } from '@babbage/sdk-ts'


// TODO Move to helper file!
interface DecryptedField {
    firstName: string
    profilePhoto: string
}
interface SigniaResult {
    subject: string
    decryptedFields: DecryptedField
    certifier: string
}
interface IdentityProps {
  identityKey: string
}

const IdentityCard: React.FC<IdentityProps> = ({ identityKey }) => {
    const [resolvedIdentity, setResolvedIdentity] = useState({ name: 'Unknown', profilePhoto: 'tbd'} as Identity)

    useEffect(() => {
        (async () => {
          try {
            // Resolve a Signia verified identity from a counterparty
            // debugger
            const matchingIdentities = await discoverByIdentityKey({
                identityKey,
                description: 'Resolve identity information from your trusted certifiers.'
            })

            // TODO: Kernel should use trust points!
            if (matchingIdentities.length > 0) {
              const selectedIdentity = matchingIdentities[0] as SigniaResult
              setResolvedIdentity({
                  name: selectedIdentity.decryptedFields.firstName,
                  profilePhoto: selectedIdentity.decryptedFields.profilePhoto,
                  identityKey: selectedIdentity.subject,
                  certifier: selectedIdentity.certifier
              })
            }
          } catch (e) { }
        })()
      }, [])

    return (
      <Card sx={{ display: 'flex', alignItems: 'center', borderRadius: '16px', padding: '0.2em 0.4em 0.2em 0.5em', maxWidth: 345, backgroundColor: 'transparent' }}>
        <Avatar alt={resolvedIdentity.name} src={resolvedIdentity.profilePhoto} sx={{ width: '2.5em', height: '2.5em' }} />
        <CardContent sx={{ flex: '1 0 auto', padding: '8px !important', "&:last-child": { paddingBottom: '8px !important' } }}>
            <Typography variant="h6" component="div" fontSize={'1em'}>
            {resolvedIdentity.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {identityKey ? identityKey.slice(0, 10): <></>}
            </Typography>
        </CardContent>
      </Card>
    )
  }
  
  export default IdentityCard